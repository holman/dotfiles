#!/usr/bin/env python
# -*- coding: utf-8 -*-



import sys, os, re
import logging
import collections

is_py3k = sys.version_info[0] > 2

if is_py3k:
    import _thread as thread

    from io import StringIO

    str = str
    raw_input = input
else:
    import _thread

    try:
        from io import StringIO
    except ImportError:
        from io import StringIO

try:
    import json
except ImportError:
    import simplejson as json

import _PyV8

__author__ = 'Flier Lu <flier.lu@gmail.com>'
__version__ = '1.0'

__all__ = ["ReadOnly", "DontEnum", "DontDelete", "Internal",
           "JSError", "JSObject", "JSArray", "JSFunction",
           "JSClass", "JSEngine", "JSContext",
           "JSObjectSpace", "JSAllocationAction",
           "JSStackTrace", "JSStackFrame", "profiler", 
           "JSExtension", "JSLocker", "JSUnlocker", "AST"]

class JSAttribute(object):
    def __init__(self, name):
        self.name = name

    def __call__(self, func):
        setattr(func, "__%s__" % self.name, True)
        
        return func

ReadOnly = JSAttribute(name='readonly')
DontEnum = JSAttribute(name='dontenum')
DontDelete = JSAttribute(name='dontdel')
Internal = JSAttribute(name='internal')

class JSError(Exception):
    def __init__(self, impl):
        Exception.__init__(self)

        self._impl = impl

    def __str__(self):
        return str(self._impl)

    def __unicode__(self, *args, **kwargs):
        return str(self._impl)

    def __getattribute__(self, attr):
        impl = super(JSError, self).__getattribute__("_impl")

        try:
            return getattr(impl, attr)
        except AttributeError:
            return super(JSError, self).__getattribute__(attr)

    RE_FRAME = re.compile(r"\s+at\s(?:new\s)?(?P<func>.+)\s\((?P<file>[^:]+):?(?P<row>\d+)?:?(?P<col>\d+)?\)")
    RE_FUNC = re.compile(r"\s+at\s(?:new\s)?(?P<func>.+)\s\((?P<file>[^\)]+)\)")
    RE_FILE = re.compile(r"\s+at\s(?P<file>[^:]+):?(?P<row>\d+)?:?(?P<col>\d+)?")

    @staticmethod
    def parse_stack(value):
        stack = []

        def int_or_nul(value):
            return int(value) if value else None

        for line in value.split('\n')[1:]:
            m = JSError.RE_FRAME.match(line)

            if m:
                stack.append((m.group('func'), m.group('file'), int_or_nul(m.group('row')), int_or_nul(m.group('col'))))
                continue

            m = JSError.RE_FUNC.match(line)

            if m:
                stack.append((m.group('func'), m.group('file'), None, None))
                continue

            m = JSError.RE_FILE.match(line)

            if m:
                stack.append((None, m.group('file'), int_or_nul(m.group('row')), int_or_nul(m.group('col'))))
                continue

            assert line

        return stack

    @property
    def frames(self):
        return self.parse_stack(self.stackTrace)

_PyV8._JSError._jsclass = JSError

JSObject = _PyV8.JSObject
JSArray = _PyV8.JSArray
JSFunction = _PyV8.JSFunction

# contribute by e.generalov

JS_ESCAPABLE = re.compile(r'([^\x00-\x7f])')
HAS_UTF8 = re.compile(r'[\x80-\xff]')

def _js_escape_unicode_re_callack(match):
    n = ord(match.group(0))
    if n < 0x10000:
        return '\\u%04x' % (n,)
    else:
        # surrogate pair
        n -= 0x10000
        s1 = 0xd800 | ((n >> 10) & 0x3ff)
        s2 = 0xdc00 | (n & 0x3ff)
        return '\\u%04x\\u%04x' % (s1, s2)

def js_escape_unicode(text):
    """Return an ASCII-only representation of a JavaScript string"""
    if isinstance(text, str):
        if HAS_UTF8.search(text) is None:
            return text

        text = text.decode('UTF-8')

    return str(JS_ESCAPABLE.sub(_js_escape_unicode_re_callack, text))

class JSExtension(_PyV8.JSExtension):
    def __init__(self, name, source, callback=None, dependencies=[], register=True):
        _PyV8.JSExtension.__init__(self, js_escape_unicode(name), js_escape_unicode(source), callback, dependencies, register)

def func_apply(self, thisArg, argArray=[]):
    if isinstance(thisArg, JSObject):
        return self.invoke(thisArg, argArray)

    this = JSContext.current.eval("(%s)" % json.dumps(thisArg))

    return self.invoke(this, argArray)

JSFunction.apply = func_apply

class JSLocker(_PyV8.JSLocker):
    def __enter__(self):
        self.enter()

        if JSContext.entered:
            self.leave()
            raise RuntimeError("Lock should be acquired before enter the context")

        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if JSContext.entered:
            self.leave()
            raise RuntimeError("Lock should be released after leave the context")

        self.leave()

    if is_py3k:
        def __bool__(self):
            return self.entered()
    else:
        def __nonzero__(self):
            return self.entered()

class JSUnlocker(_PyV8.JSUnlocker):
    def __enter__(self):
        self.enter()

        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.leave()

    if is_py3k:
        def __bool__(self):
            return self.entered()
    else:
        def __nonzero__(self):
            return self.entered()

class JSClass(object):
    __properties__ = {}
    __watchpoints__ = {}

    def __getattr__(self, name):
        if name == 'constructor':
            return JSClassConstructor(self.__class__)

        if name == 'prototype':
            return JSClassPrototype(self.__class__)

        prop = self.__dict__.setdefault('__properties__', {}).get(name, None)

        if prop and isinstance(prop[0], collections.Callable):
            return prop[0]()

        raise AttributeError(name)

    def __setattr__(self, name, value):
        prop = self.__dict__.setdefault('__properties__', {}).get(name, None)

        if prop and isinstance(prop[1], collections.Callable):
            return prop[1](value)

        return object.__setattr__(self, name, value)

    def toString(self):
        "Returns a string representation of an object."
        return "[object %s]" % self.__class__.__name__

    def toLocaleString(self):
        "Returns a value as a string value appropriate to the host environment's current locale."
        return self.toString()

    def valueOf(self):
        "Returns the primitive value of the specified object."
        return self

    def hasOwnProperty(self, name):
        "Returns a Boolean value indicating whether an object has a property with the specified name."
        return hasattr(self, name)

    def isPrototypeOf(self, obj):
        "Returns a Boolean value indicating whether an object exists in the prototype chain of another object."
        raise NotImplementedError()

    def __defineGetter__(self, name, getter):
        "Binds an object's property to a function to be called when that property is looked up."
        self.__properties__[name] = (getter, self.__lookupSetter__(name))

    def __lookupGetter__(self, name):
        "Return the function bound as a getter to the specified property."
        return self.__properties__.get(name, (None, None))[0]

    def __defineSetter__(self, name, setter):
        "Binds an object's property to a function to be called when an attempt is made to set that property."
        self.__properties__[name] = (self.__lookupGetter__(name), setter)

    def __lookupSetter__(self, name):
        "Return the function bound as a setter to the specified property."
        return self.__properties__.get(name, (None, None))[1]

    def watch(self, prop, handler):
        "Watches for a property to be assigned a value and runs a function when that occurs."
        self.__watchpoints__[prop] = handler

    def unwatch(self, prop):
        "Removes a watchpoint set with the watch method."
        del self.__watchpoints__[prop]

class JSClassConstructor(JSClass):
    def __init__(self, cls):
        self.cls = cls

    @property
    def name(self):
        return self.cls.__name__

    def toString(self):
        return "function %s() {\n  [native code]\n}" % self.name

    def __call__(self, *args, **kwds):
        return self.cls(*args, **kwds)

class JSClassPrototype(JSClass):
    def __init__(self, cls):
        self.cls = cls

    @property
    def constructor(self):
        return JSClassConstructor(self.cls)

    @property
    def name(self):
        return self.cls.__name__

class JSDebugProtocol(object):
    """
    Support the V8 debugger JSON based protocol.

    <http://code.google.com/p/v8/wiki/DebuggerProtocol>
    """
    class Packet(object):
        REQUEST = 'request'
        RESPONSE = 'response'
        EVENT = 'event'

        def __init__(self, payload):
            self.data = json.loads(payload) if type(payload) in [str, str] else payload

        @property
        def seq(self):
            return self.data['seq']

        @property
        def type(self):
            return self.data['type']

    class Request(Packet):
        @property
        def cmd(self):
            return self.data['command']

        @property
        def args(self):
            return self.data['args']

    class Response(Packet):
        @property
        def request_seq(self):
            return self.data['request_seq']

        @property
        def cmd(self):
            return self.data['command']

        @property
        def body(self):
            return self.data['body']

        @property
        def running(self):
            return self.data['running']

        @property
        def success(self):
            return self.data['success']

        @property
        def message(self):
            return self.data['message']

    class Event(Packet):
        @property
        def event(self):
            return self.data['event']

        @property
        def body(self):
            return self.data['body']

    def __init__(self):
        self.seq = 0

    def nextSeq(self):
        seq = self.seq
        self.seq += 1

        return seq

    def parsePacket(self, payload):
        obj = json.loads(payload)

        return JSDebugProtocol.Event(obj) if obj['type'] == 'event' else JSDebugProtocol.Response(obj)
    
class JSDebugEvent(_PyV8.JSDebugEvent):
    class FrameData(object):
        def __init__(self, frame, count, name, value):
            self.frame = frame
            self.count = count
            self.name = name
            self.value = value

        def __len__(self):
            return self.count(self.frame)

        def __iter__(self):
            for i in range(self.count(self.frame)):
                yield (self.name(self.frame, i), self.value(self.frame, i))

    class Frame(object):
        def __init__(self, frame):
            self.frame = frame

        @property
        def index(self):
            return int(self.frame.index())

        @property
        def function(self):
            return self.frame.func()

        @property
        def receiver(self):
            return self.frame.receiver()

        @property
        def isConstructCall(self):
            return bool(self.frame.isConstructCall())

        @property
        def isDebuggerFrame(self):
            return bool(self.frame.isDebuggerFrame())

        @property
        def argumentCount(self):
            return int(self.frame.argumentCount())

        def argumentName(self, idx):
            return str(self.frame.argumentName(idx))

        def argumentValue(self, idx):
            return self.frame.argumentValue(idx)

        @property
        def arguments(self):
            return JSDebugEvent.FrameData(self, self.argumentCount, self.argumentName, self.argumentValue)

        def localCount(self, idx):
            return int(self.frame.localCount())

        def localName(self, idx):
            return str(self.frame.localName(idx))

        def localValue(self, idx):
            return self.frame.localValue(idx)

        @property
        def locals(self):
            return JSDebugEvent.FrameData(self, self.localCount, self.localName, self.localValue)

        @property
        def sourcePosition(self):
            return self.frame.sourcePosition()

        @property
        def sourceLine(self):
            return int(self.frame.sourceLine())

        @property
        def sourceColumn(self):
            return int(self.frame.sourceColumn())

        @property
        def sourceLineText(self):
            return str(self.frame.sourceLineText())

        def evaluate(self, source, disable_break = True):
            return self.frame.evaluate(source, disable_break)

        @property
        def invocationText(self):
            return str(self.frame.invocationText())

        @property
        def sourceAndPositionText(self):
            return str(self.frame.sourceAndPositionText())

        @property
        def localsText(self):
            return str(self.frame.localsText())

        def __str__(self):
            return str(self.frame.toText())

    class Frames(object):
        def __init__(self, state):
            self.state = state

        def __len__(self):
            return self.state.frameCount

        def __iter__(self):
            for i in range(self.state.frameCount):
                yield self.state.frame(i)

    class State(object):
        def __init__(self, state):
            self.state = state

        @property
        def frameCount(self):
            return int(self.state.frameCount())

        def frame(self, idx = None):
            return JSDebugEvent.Frame(self.state.frame(idx))

        @property
        def selectedFrame(self):
            return int(self.state.selectedFrame())

        @property
        def frames(self):
            return JSDebugEvent.Frames(self)

        def __repr__(self):
            s = StringIO()

            try:
                for frame in self.frames:
                    s.write(str(frame))

                return s.getvalue()
            finally:
                s.close()

    class DebugEvent(object):
        pass

    class StateEvent(DebugEvent):
        __state = None

        @property
        def state(self):
            if not self.__state:
                self.__state = JSDebugEvent.State(self.event.executionState())

            return self.__state

    class BreakEvent(StateEvent):
        type = _PyV8.JSDebugEvent.Break

        def __init__(self, event):
            self.event = event

    class ExceptionEvent(StateEvent):
        type = _PyV8.JSDebugEvent.Exception

        def __init__(self, event):
            self.event = event

    class NewFunctionEvent(DebugEvent):
        type = _PyV8.JSDebugEvent.NewFunction

        def __init__(self, event):
            self.event = event

    class Script(object):
        def __init__(self, script):
            self.script = script

        @property
        def source(self):
            return self.script.source()

        @property
        def id(self):
            return self.script.id()

        @property
        def name(self):
            return self.script.name()

        @property
        def lineOffset(self):
            return self.script.lineOffset()

        @property
        def lineCount(self):
            return self.script.lineCount()

        @property
        def columnOffset(self):
            return self.script.columnOffset()

        @property
        def type(self):
            return self.script.type()

        def __repr__(self):
            return "<%s script %s @ %d:%d> : '%s'" % (self.type, self.name,
                                                      self.lineOffset, self.columnOffset,
                                                      self.source)

    class CompileEvent(StateEvent):
        def __init__(self, event):
            self.event = event

        @property
        def script(self):
            if not hasattr(self, "_script"):
                setattr(self, "_script", JSDebugEvent.Script(self.event.script()))

            return self._script

        def __str__(self):
            return str(self.script)

    class BeforeCompileEvent(CompileEvent):
        type = _PyV8.JSDebugEvent.BeforeCompile

        def __init__(self, event):
            JSDebugEvent.CompileEvent.__init__(self, event)

        def __repr__(self):
            return "before compile script: %s\n%s" % (repr(self.script), repr(self.state))

    class AfterCompileEvent(CompileEvent):
        type = _PyV8.JSDebugEvent.AfterCompile

        def __init__(self, event):
            JSDebugEvent.CompileEvent.__init__(self, event)

        def __repr__(self):
            return "after compile script: %s\n%s" % (repr(self.script), repr(self.state))

    onMessage = None
    onBreak = None
    onException = None
    onNewFunction = None
    onBeforeCompile = None
    onAfterCompile = None

class JSDebugger(JSDebugProtocol, JSDebugEvent):
    def __init__(self):
        JSDebugProtocol.__init__(self)
        JSDebugEvent.__init__(self)

    def __enter__(self):
        self.enabled = True

        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.enabled = False

    @property
    def context(self):
        if not hasattr(self, '_context'):
            self._context = JSContext(ctxt=_PyV8.debug().context)

        return self._context

    def isEnabled(self):
        return _PyV8.debug().enabled

    def setEnabled(self, enable):
        dbg = _PyV8.debug()

        if enable:
            dbg.onDebugEvent = self.onDebugEvent
            dbg.onDebugMessage = self.onDebugMessage
            dbg.onDispatchDebugMessages = self.onDispatchDebugMessages
        else:
            dbg.onDebugEvent = None
            dbg.onDebugMessage = None
            dbg.onDispatchDebugMessages = None

        dbg.enabled = enable

    enabled = property(isEnabled, setEnabled)

    def onDebugMessage(self, msg, data):
        if self.onMessage:
            self.onMessage(json.loads(msg))

    def onDebugEvent(self, type, state, evt):
        if type == JSDebugEvent.Break:
            if self.onBreak: self.onBreak(JSDebugEvent.BreakEvent(evt))
        elif type == JSDebugEvent.Exception:
            if self.onException: self.onException(JSDebugEvent.ExceptionEvent(evt))
        elif type == JSDebugEvent.NewFunction:
            if self.onNewFunction: self.onNewFunction(JSDebugEvent.NewFunctionEvent(evt))
        elif type == JSDebugEvent.BeforeCompile:
            if self.onBeforeCompile: self.onBeforeCompile(JSDebugEvent.BeforeCompileEvent(evt))
        elif type == JSDebugEvent.AfterCompile:
            if self.onAfterCompile: self.onAfterCompile(JSDebugEvent.AfterCompileEvent(evt))

    def onDispatchDebugMessages(self):
        return True

    def debugBreak(self):
        _PyV8.debug().debugBreak()

    def debugBreakForCommand(self):
        _PyV8.debug().debugBreakForCommand()

    def cancelDebugBreak(self):
        _PyV8.debug().cancelDebugBreak()

    def processDebugMessages(self):
        _PyV8.debug().processDebugMessages()

    def sendCommand(self, cmd, *args, **kwds):
        request = json.dumps({
            'seq': self.nextSeq(),
            'type': 'request',
            'command': cmd,
            'arguments': kwds
        })

        _PyV8.debug().sendCommand(request)

        return request

    def debugContinue(self, action='next', steps=1):
        return self.sendCommand('continue', stepaction=action)

    def stepNext(self, steps=1):
        """Step to the next statement in the current function."""
        return self.debugContinue(action='next', steps=steps)

    def stepIn(self, steps=1):
        """Step into new functions invoked or the next statement in the current function."""
        return self.debugContinue(action='in', steps=steps)

    def stepOut(self, steps=1):
        """Step out of the current function."""
        return self.debugContinue(action='out', steps=steps)

    def stepMin(self, steps=1):
        """Perform a minimum step in the current function."""
        return self.debugContinue(action='out', steps=steps)

class JSProfiler(_PyV8.JSProfiler):
    @property
    def logs(self):
        pos = 0

        while True:
            size, buf = self.getLogLines(pos)

            if size == 0:
                break

            for line in buf.split('\n'):
                yield line

            pos += size

profiler = JSProfiler()

JSObjectSpace = _PyV8.JSObjectSpace
JSAllocationAction = _PyV8.JSAllocationAction

class JSEngine(_PyV8.JSEngine):
    def __init__(self):
        _PyV8.JSEngine.__init__(self)
        
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        del self

JSScript = _PyV8.JSScript

JSStackTrace = _PyV8.JSStackTrace
JSStackTrace.Options = _PyV8.JSStackTraceOptions
JSStackFrame = _PyV8.JSStackFrame

class JSIsolate(_PyV8.JSIsolate):
    def __enter__(self):
        self.enter()

        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.leave()

        del self

class JSContext(_PyV8.JSContext):
    def __init__(self, obj=None, extensions=None, ctxt=None):
        if JSLocker.active:
            self.lock = JSLocker()
            self.lock.enter()

        if ctxt:
            _PyV8.JSContext.__init__(self, ctxt)
        else:
            _PyV8.JSContext.__init__(self, obj, extensions or [])

    def __enter__(self):
        self.enter()

        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.leave()

        if hasattr(JSLocker, 'lock'):
            self.lock.leave()
            self.lock = None

        del self

# contribute by marc boeker <http://code.google.com/u/marc.boeker/>
def convert(obj):
    if type(obj) == _PyV8.JSArray:
        return [convert(v) for v in obj]

    if type(obj) == _PyV8.JSObject:
        return dict([[str(k), convert(obj.__getattr__(str(k)))] for k in obj.__members__])

    return obj

class AST:
    Scope = _PyV8.AstScope
    VarMode = _PyV8.AstVariableMode
    Var = _PyV8.AstVariable
    Label = _PyV8.AstLabel
    NodeType = _PyV8.AstNodeType
    Node = _PyV8.AstNode
    Statement = _PyV8.AstStatement
    Expression = _PyV8.AstExpression
    Breakable = _PyV8.AstBreakableStatement
    Block = _PyV8.AstBlock
    Declaration = _PyV8.AstDeclaration
    VariableDeclaration = _PyV8.AstVariableDeclaration
    Module = _PyV8.AstModule
    ModuleDeclaration = _PyV8.AstModuleDeclaration
    ModuleLiteral = _PyV8.AstModuleLiteral
    ModuleVariable = _PyV8.AstModuleVariable
    ModulePath = _PyV8.AstModulePath
    Iteration = _PyV8.AstIterationStatement
    DoWhile = _PyV8.AstDoWhileStatement
    While = _PyV8.AstWhileStatement
    For = _PyV8.AstForStatement
    ForIn = _PyV8.AstForInStatement
    ExpressionStatement = _PyV8.AstExpressionStatement
    Continue = _PyV8.AstContinueStatement
    Break = _PyV8.AstBreakStatement
    Return = _PyV8.AstReturnStatement
    With = _PyV8.AstWithStatement
    Case = _PyV8.AstCaseClause
    Switch = _PyV8.AstSwitchStatement
    Try = _PyV8.AstTryStatement
    TryCatch = _PyV8.AstTryCatchStatement
    TryFinally = _PyV8.AstTryFinallyStatement
    Debugger = _PyV8.AstDebuggerStatement
    Empty = _PyV8.AstEmptyStatement
    Literal = _PyV8.AstLiteral
    MaterializedLiteral = _PyV8.AstMaterializedLiteral
    PropertyKind = _PyV8.AstPropertyKind
    ObjectProperty = _PyV8.AstObjectProperty
    Object = _PyV8.AstObjectLiteral
    RegExp = _PyV8.AstRegExpLiteral
    Array = _PyV8.AstArrayLiteral
    VarProxy = _PyV8.AstVariableProxy
    Property = _PyV8.AstProperty
    Call = _PyV8.AstCall
    CallNew = _PyV8.AstCallNew
    CallRuntime = _PyV8.AstCallRuntime
    Op = _PyV8.AstOperation
    UnaryOp = _PyV8.AstUnaryOperation
    BinOp = _PyV8.AstBinaryOperation
    CountOp = _PyV8.AstCountOperation
    CompOp = _PyV8.AstCompareOperation
    Conditional = _PyV8.AstConditional
    Assignment = _PyV8.AstAssignment
    Throw = _PyV8.AstThrow
    Function = _PyV8.AstFunctionLiteral
    SharedFunction = _PyV8.AstSharedFunctionInfoLiteral
    This = _PyV8.AstThisFunction

from datetime import *
import unittest
import traceback

if is_py3k:
    def toNativeString(s):
        return s
    def toUnicodeString(s):
        return s
else:
    def toNativeString(s, encoding='utf-8'):
        return s.encode(encoding) if isinstance(s, str) else s

    def toUnicodeString(s, encoding='utf-8'):
        return s if isinstance(s, str) else str(s, encoding)

class TestContext(unittest.TestCase):
    def testMultiNamespace(self):
        self.assertTrue(not bool(JSContext.inContext))
        self.assertTrue(not bool(JSContext.entered))

        class Global(object):
            name = "global"

        g = Global()

        with JSContext(g) as ctxt:
            self.assertTrue(bool(JSContext.inContext))
            self.assertEqual(g.name, str(JSContext.entered.locals.name))
            self.assertEqual(g.name, str(JSContext.current.locals.name))

            class Local(object):
                name = "local"

            l = Local()

            with JSContext(l):
                self.assertTrue(bool(JSContext.inContext))
                self.assertEqual(l.name, str(JSContext.entered.locals.name))
                self.assertEqual(l.name, str(JSContext.current.locals.name))

            self.assertTrue(bool(JSContext.inContext))
            self.assertEqual(g.name, str(JSContext.entered.locals.name))
            self.assertEqual(g.name, str(JSContext.current.locals.name))

        self.assertTrue(not bool(JSContext.entered))
        self.assertTrue(not bool(JSContext.inContext))

    def _testMultiContext(self):
        # Create an environment
        with JSContext() as ctxt0:
            ctxt0.securityToken = "password"

            global0 = ctxt0.locals
            global0.custom = 1234

            self.assertEqual(1234, int(global0.custom))

            # Create an independent environment
            with JSContext() as ctxt1:
                ctxt1.securityToken = ctxt0.securityToken

                global1 = ctxt1.locals
                global1.custom = 1234

                with ctxt0:
                    self.assertEqual(1234, int(global0.custom))
                self.assertEqual(1234, int(global1.custom))

                # Now create a new context with the old global
                with JSContext(global1) as ctxt2:
                    ctxt2.securityToken = ctxt1.securityToken

                    with ctxt1:
                        self.assertEqual(1234, int(global1.custom))

    def _testSecurityChecks(self):
        with JSContext() as env1:
            env1.securityToken = "foo"

            # Create a function in env1.
            env1.eval("spy=function(){return spy;}")

            spy = env1.locals.spy

            self.assertTrue(isinstance(spy, _PyV8.JSFunction))

            # Create another function accessing global objects.
            env1.eval("spy2=function(){return 123;}")

            spy2 = env1.locals.spy2

            self.assertTrue(isinstance(spy2, _PyV8.JSFunction))

            # Switch to env2 in the same domain and invoke spy on env2.
            env2 = JSContext()

            env2.securityToken = "foo"

            with env2:
                result = spy.apply(env2.locals)

                self.assertTrue(isinstance(result, _PyV8.JSFunction))

            env2.securityToken = "bar"

            # Call cross_domain_call, it should throw an exception
            with env2:
                self.assertRaises(JSError, spy2.apply, env2.locals)

    def _testCrossDomainDelete(self):
        with JSContext() as env1:
            env2 = JSContext()

            # Set to the same domain.
            env1.securityToken = "foo"
            env2.securityToken = "foo"

            env1.locals.prop = 3

            env2.locals.env1 = env1.locals

            # Change env2 to a different domain and delete env1.prop.
            #env2.securityToken = "bar"

            self.assertEqual(3, int(env1.eval("prop")))

            with env2:
                self.assertEqual(3, int(env2.eval("this.env1.prop")))
                self.assertEqual("false", str(env2.eval("delete env1.prop")))

            # Check that env1.prop still exists.
            self.assertEqual(3, int(env1.locals.prop))

class TestWrapper(unittest.TestCase):
    def testObject(self):
        with JSContext() as ctxt:
            o = ctxt.eval("new Object()")

            self.assertTrue(hash(o) > 0)

            o1 = o.clone()

            self.assertEqual(hash(o1), hash(o))
            self.assertTrue(o != o1)

        self.assertRaises(UnboundLocalError, o.clone)

    def testAutoConverter(self):
        with JSContext() as ctxt:
            ctxt.eval("""
                var_i = 1;
                var_f = 1.0;
                var_s = "test";
                var_b = true;
                var_s_obj = new String("test");
                var_b_obj = new Boolean(true);
                var_f_obj = new Number(1.5);
            """)

            vars = ctxt.locals

            var_i = vars.var_i

            self.assertTrue(var_i)
            self.assertEqual(1, int(var_i))

            var_f = vars.var_f

            self.assertTrue(var_f)
            self.assertEqual(1.0, float(vars.var_f))

            var_s = vars.var_s
            self.assertTrue(var_s)
            self.assertEqual("test", str(vars.var_s))

            var_b = vars.var_b
            self.assertTrue(var_b)
            self.assertTrue(bool(var_b))

            self.assertEqual("test", vars.var_s_obj)
            self.assertTrue(vars.var_b_obj)
            self.assertEqual(1.5, vars.var_f_obj)

            attrs = dir(ctxt.locals)

            self.assertTrue(attrs)
            self.assertTrue("var_i" in attrs)
            self.assertTrue("var_f" in attrs)
            self.assertTrue("var_s" in attrs)
            self.assertTrue("var_b" in attrs)
            self.assertTrue("var_s_obj" in attrs)
            self.assertTrue("var_b_obj" in attrs)
            self.assertTrue("var_f_obj" in attrs)

    def testExactConverter(self):
        class MyInteger(int, JSClass):
            pass

        class MyString(str, JSClass):
            pass

        class MyUnicode(str, JSClass):
            pass

        class MyDateTime(time, JSClass):
            pass

        class Global(JSClass):
            var_bool = True
            var_int = 1
            var_float = 1.0
            var_str = 'str'
            var_unicode = 'unicode'
            var_datetime = datetime.now()
            var_date = date.today()
            var_time = time()

            var_myint = MyInteger()
            var_mystr = MyString('mystr')
            var_myunicode = MyUnicode('myunicode')
            var_mytime = MyDateTime()

        with JSContext(Global()) as ctxt:
            typename = ctxt.eval("(function (name) { return this[name].constructor.name; })")
            typeof = ctxt.eval("(function (name) { return typeof(this[name]); })")

            self.assertEqual('Boolean', typename('var_bool'))
            self.assertEqual('Number', typename('var_int'))
            self.assertEqual('Number', typename('var_float'))
            self.assertEqual('String', typename('var_str'))
            self.assertEqual('String', typename('var_unicode'))
            self.assertEqual('Date', typename('var_datetime'))
            self.assertEqual('Date', typename('var_date'))
            self.assertEqual('Date', typename('var_time'))

            self.assertEqual('MyInteger', typename('var_myint'))
            self.assertEqual('MyString', typename('var_mystr'))
            self.assertEqual('MyUnicode', typename('var_myunicode'))
            self.assertEqual('MyDateTime', typename('var_mytime'))

            self.assertEqual('object', typeof('var_myint'))
            self.assertEqual('object', typeof('var_mystr'))
            self.assertEqual('object', typeof('var_myunicode'))
            self.assertEqual('object', typeof('var_mytime'))

    def testJavascriptWrapper(self):
        with JSContext() as ctxt:
            self.assertEqual(type(None), type(ctxt.eval("null")))
            self.assertEqual(type(None), type(ctxt.eval("undefined")))
            self.assertEqual(bool, type(ctxt.eval("true")))
            self.assertEqual(str, type(ctxt.eval("'test'")))
            self.assertEqual(int, type(ctxt.eval("123")))
            self.assertEqual(float, type(ctxt.eval("3.14")))
            self.assertEqual(datetime, type(ctxt.eval("new Date()")))
            self.assertEqual(JSArray, type(ctxt.eval("[1, 2, 3]")))
            self.assertEqual(JSFunction, type(ctxt.eval("(function() {})")))
            self.assertEqual(JSObject, type(ctxt.eval("new Object()")))

    def testPythonWrapper(self):
        with JSContext() as ctxt:
            typeof = ctxt.eval("(function type(value) { return typeof value; })")
            protoof = ctxt.eval("(function protoof(value) { return Object.prototype.toString.apply(value); })")

            self.assertEqual('[object Null]', protoof(None))
            self.assertEqual('boolean', typeof(True))
            self.assertEqual('number', typeof(123))
            self.assertEqual('number', typeof(3.14))
            self.assertEqual('string', typeof('test'))
            self.assertEqual('string', typeof('test'))

            self.assertEqual('[object Date]', protoof(datetime.now()))
            self.assertEqual('[object Date]', protoof(date.today()))
            self.assertEqual('[object Date]', protoof(time()))

            def test():
                pass

            self.assertEqual('[object Function]', protoof(abs))
            self.assertEqual('[object Function]', protoof(test))
            self.assertEqual('[object Function]', protoof(self.testPythonWrapper))
            self.assertEqual('[object Function]', protoof(int))

    def testFunction(self):
        with JSContext() as ctxt:
            func = ctxt.eval("""
                (function ()
                {
                    function a()
                    {
                        return "abc";
                    }

                    return a();
                })
                """)

            self.assertEqual("abc", str(func()))
            self.assertTrue(func != None)
            self.assertFalse(func == None)

            func = ctxt.eval("(function test() {})")

            self.assertEqual("test", func.name)
            self.assertEqual("", func.resname)
            self.assertEqual(0, func.linenum)
            self.assertEqual(14, func.colnum)
            self.assertEqual(0, func.lineoff)
            self.assertEqual(0, func.coloff)
            
            #TODO fix me, why the setter doesn't work?
            # func.name = "hello"
            # it seems __setattr__ was called instead of CJavascriptFunction::SetName

            func.setName("hello")

            self.assertEqual("hello", func.name)

    def testCall(self):
        class Hello(object):
            def __call__(self, name):
                return "hello " + name

        class Global(JSClass):
            hello = Hello()

        with JSContext(Global()) as ctxt:
            self.assertEqual("hello flier", ctxt.eval("hello('flier')"))

    def testJSFunction(self):
        with JSContext() as ctxt:
            hello = ctxt.eval("(function (name) { return 'hello ' + name; })")

            self.assertTrue(isinstance(hello, _PyV8.JSFunction))
            self.assertEqual("hello flier", hello('flier'))
            self.assertEqual("hello flier", hello.invoke(['flier']))

            obj = ctxt.eval("({ 'name': 'flier', 'hello': function (name) { return 'hello ' + name + ' from ' + this.name; }})")
            hello = obj.hello
            self.assertTrue(isinstance(hello, JSFunction))
            self.assertEqual("hello flier from flier", hello('flier'))

            tester = ctxt.eval("({ 'name': 'tester' })")
            self.assertEqual("hello flier from tester", hello.invoke(tester, ['flier']))
            self.assertEqual("hello flier from json", hello.apply({ 'name': 'json' }, ['flier']))

    def testConstructor(self):
        with JSContext() as ctx:
            ctx.eval("""
                var Test = function() {
                    this.trySomething();
                };
                Test.prototype.trySomething = function() {
                    this.name = 'flier';
                };

                var Test2 = function(first_name, last_name) {
                    this.name = first_name + ' ' + last_name;
                };
                """)

            self.assertTrue(isinstance(ctx.locals.Test, _PyV8.JSFunction))

            test = JSObject.create(ctx.locals.Test)

            self.assertTrue(isinstance(ctx.locals.Test, _PyV8.JSObject))
            self.assertEqual("flier", test.name);

            test2 = JSObject.create(ctx.locals.Test2, ('Flier', 'Lu'))

            self.assertEqual("Flier Lu", test2.name);

            test3 = JSObject.create(ctx.locals.Test2, ('Flier', 'Lu'), { 'email': 'flier.lu@gmail.com' })

            self.assertEqual("flier.lu@gmail.com", test3.email);

    def testJSError(self):
        with JSContext() as ctxt:
            try:
                ctxt.eval('throw "test"')
                self.fail()
            except:
                self.assertTrue(JSError, sys.exc_info()[0])

    def testErrorInfo(self):
        with JSContext() as ctxt:
            with JSEngine() as engine:
                try:
                    engine.compile("""
                        function hello()
                        {
                            throw Error("hello world");
                        }

                        hello();""", "test", 10, 10).run()
                    self.fail()
                except JSError as e:
                    self.assertTrue(str(e).startswith('JSError: Error: hello world ( test @ 14 : 34 )  ->'))
                    self.assertEqual("Error", e.name)
                    self.assertEqual("hello world", e.message)
                    self.assertEqual("test", e.scriptName)
                    self.assertEqual(14, e.lineNum)
                    self.assertEqual(102, e.startPos)
                    self.assertEqual(103, e.endPos)
                    self.assertEqual(34, e.startCol)
                    self.assertEqual(35, e.endCol)
                    self.assertEqual('throw Error("hello world");', e.sourceLine.strip())
                    self.assertEqual('Error: hello world\n' +
                                     '    at Error (<anonymous>)\n' +
                                     '    at hello (test:14:35)\n' +
                                     '    at test:17:25', e.stackTrace)

    def testParseStack(self):
        self.assertEqual([
            ('Error', 'unknown source', None, None),
            ('test', 'native', None, None),
            ('<anonymous>', 'test0', 3, 5),
            ('f', 'test1', 2, 19),
            ('g', 'test2', 1, 15),
            (None, 'test3', 1, None),
            (None, 'test3', 1, 1),
        ], JSError.parse_stack("""Error: err
            at Error (unknown source)
            at test (native)
            at new <anonymous> (test0:3:5)
            at f (test1:2:19)
            at g (test2:1:15)
            at test3:1
            at test3:1:1"""))

    def testStackTrace(self):
        class Global(JSClass):
            def GetCurrentStackTrace(self, limit):
                return JSStackTrace.GetCurrentStackTrace(4, JSStackTrace.Options.Detailed)

        with JSContext(Global()) as ctxt:
            st = ctxt.eval("""
                function a()
                {
                    return GetCurrentStackTrace(10);
                }
                function b()
                {
                    return eval("a()");
                }
                function c()
                {
                    return new b();
                }
            c();""", "test")

            self.assertEqual(4, len(st))
            self.assertEqual("\tat a (test:4:28)\n\tat (eval)\n\tat b (test:8:28)\n\tat c (test:12:28)\n", str(st))
            self.assertEqual("test.a (4:28)\n. (1:1) eval\ntest.b (8:28) constructor\ntest.c (12:28)",
                              "\n".join(["%s.%s (%d:%d)%s%s" % (
                                f.scriptName, f.funcName, f.lineNum, f.column,
                                ' eval' if f.isEval else '',
                                ' constructor' if f.isConstructor else '') for f in st]))

    def testPythonException(self):
        class Global(JSClass):
            def raiseException(self):
                raise RuntimeError("Hello")

        with JSContext(Global()) as ctxt:
            r = ctxt.eval("""
                msg ="";
                try
                {
                    this.raiseException()
                }
                catch(e)
                {
                    msg += "catch " + e + ";";
                }
                finally
                {
                    msg += "finally";
                }""")
            self.assertEqual("catch Error: Hello;finally", str(ctxt.locals.msg))

    def testExceptionMapping(self):
        class TestException(Exception):
            pass

        class Global(JSClass):
            def raiseIndexError(self):
                return [1, 2, 3][5]

            def raiseAttributeError(self):
                None.hello()

            def raiseSyntaxError(self):
                eval("???")

            def raiseTypeError(self):
                int(sys)

            def raiseNotImplementedError(self):
                raise NotImplementedError("Not support")

            def raiseExceptions(self):
                raise TestException()

        with JSContext(Global()) as ctxt:
            ctxt.eval("try { this.raiseIndexError(); } catch (e) { msg = e; }")

            self.assertEqual("RangeError: list index out of range", str(ctxt.locals.msg))

            ctxt.eval("try { this.raiseAttributeError(); } catch (e) { msg = e; }")

            self.assertEqual("ReferenceError: 'NoneType' object has no attribute 'hello'", str(ctxt.locals.msg))

            ctxt.eval("try { this.raiseSyntaxError(); } catch (e) { msg = e; }")

            self.assertEqual("SyntaxError: invalid syntax", str(ctxt.locals.msg))

            ctxt.eval("try { this.raiseTypeError(); } catch (e) { msg = e; }")

            self.assertEqual("TypeError: int() argument must be a string or a number, not 'module'", str(ctxt.locals.msg))

            ctxt.eval("try { this.raiseNotImplementedError(); } catch (e) { msg = e; }")

            self.assertEqual("Error: Not support", str(ctxt.locals.msg))

            self.assertRaises(TestException, ctxt.eval, "this.raiseExceptions();")

    def testArray(self):
        with JSContext() as ctxt:
            array = ctxt.eval("""
                var array = new Array();

                for (i=0; i<10; i++)
                {
                    array[i] = 10-i;
                }

                array;
                """)

            self.assertTrue(isinstance(array, _PyV8.JSArray))
            self.assertEqual(10, len(array))

            self.assertTrue(5 in array)
            self.assertFalse(15 in array)

            self.assertEqual(10, len(array))

            for i in range(10):
                self.assertEqual(10-i, array[i])

            array[5] = 0

            self.assertEqual(0, array[5])

            del array[5]

            self.assertEqual(None, array[5])

            # array         [10, 9, 8, 7, 6, None, 4, 3, 2, 1]
            # array[4:7]                  4^^^^^^^^^7
            # array[-3:-1]                         -3^^^^^^-1
            # array[0:0]    []

            self.assertEqual([6, None, 4], array[4:7])
            self.assertEqual([3, 2], array[-3:-1])
            self.assertEqual([], array[0:0])

            array[1:3] = [9, 9, 9]

            self.assertEqual([10, 9, 9, 9, 7, 6, None, 4, 3, 2, 1], list(array))

            array[5:8] = [8, 8]

            self.assertEqual([10, 9, 9, 9, 7, 8, 8, 3, 2, 1], list(array))

            del array[1:4]

            self.assertEqual([10, 7, 8, 8, 3, 2, 1], list(array))

            ctxt.locals.array1 = JSArray(5)
            ctxt.locals.array2 = JSArray([1, 2, 3, 4, 5])

            for i in range(len(ctxt.locals.array2)):
                ctxt.locals.array1[i] = ctxt.locals.array2[i] * 10

            ctxt.eval("""
                var sum = 0;

                for (i=0; i<array1.length; i++)
                    sum += array1[i]

                for (i=0; i<array2.length; i++)
                    sum += array2[i]
                """)

            self.assertEqual(165, ctxt.locals.sum)

            ctxt.locals.array3 = [1, 2, 3, 4, 5]
            self.assertTrue(ctxt.eval('array3[1] === 2'))
            self.assertTrue(ctxt.eval('array3[9] === undefined'))

            cases = [
                ("a = Array(7); for(i=0; i<a.length; i++) a[i] = i; a[3] = undefined; a[a.length-1]; a", "0,1,2,,4,5,6", [0, 1, 2, None, 4, 5, 6]),
                ("a = Array(7); for(i=0; i<a.length - 1; i++) a[i] = i; a[a.length-1]; a", "0,1,2,3,4,5,", [0, 1, 2, 3, 4, 5, None]),
                ("a = Array(7); for(i=1; i<a.length; i++) a[i] = i; a[a.length-1]; a", ",1,2,3,4,5,6", [None, 1, 2, 3, 4, 5, 6])
            ]

            for case in cases:
                array = ctxt.eval(case[0])

                self.assertEqual(case[1], str(array))
                self.assertEqual(case[2], [array[i] for i in range(len(array))])

            self.assertEqual(3, ctxt.eval("(function (arr) { return arr.length; })")(JSArray([1, 2, 3])))
            self.assertEqual(2, ctxt.eval("(function (arr, idx) { return arr[idx]; })")(JSArray([1, 2, 3]), 1))
            self.assertEqual('[object Array]', ctxt.eval("(function (arr) { return Object.prototype.toString.call(arr); })")(JSArray([1, 2, 3])))
            self.assertEqual('[object Array]', ctxt.eval("(function (arr) { return Object.prototype.toString.call(arr); })")(JSArray((1, 2, 3))))
            self.assertEqual('[object Array]', ctxt.eval("(function (arr) { return Object.prototype.toString.call(arr); })")(JSArray(list(range(3)))))

            [x for x in JSArray([1,2,3])]

    def testMultiDimArray(self):
        with JSContext() as ctxt:
            ret = ctxt.eval("""
                ({
                    'test': function(){
                        return  [
                            [ 1, 'abla' ],
                            [ 2, 'ajkss' ],
                        ]
                    }
                })
                """).test()

            self.assertEqual([[1, 'abla'], [2, 'ajkss']], convert(ret))

    def testLazyConstructor(self):
        class Globals(JSClass):
            def __init__(self):
                self.array=JSArray([1,2,3])

        with JSContext(Globals()) as ctxt:
            self.assertEqual(2, ctxt.eval("""array[1]"""))

    def testForEach(self):
        class NamedClass(object):
            foo = 1

            def __init__(self):
                self.bar = 2

            @property
            def foobar(self):
                return self.foo + self.bar

        def gen(x):
            for i in range(x):
                yield i

        with JSContext() as ctxt:
            func = ctxt.eval("""(function (k) {
                var result = [];
                for (var prop in k) {
                  result.push(prop);
                }
                return result;
            })""")

            self.assertTrue(set(["bar", "foo", "foobar"]).issubset(set(func(NamedClass()))))
            self.assertEqual(["0", "1", "2"], list(func([1, 2, 3])))
            self.assertEqual(["0", "1", "2"], list(func((1, 2, 3))))
            self.assertEqual(["1", "2", "3"], list(func({1:1, 2:2, 3:3})))

            self.assertEqual(["0", "1", "2"], list(func(gen(3))))

    def testDict(self):
        with JSContext() as ctxt:
            obj = ctxt.eval("var r = { 'a' : 1, 'b' : 2 }; r")

            self.assertEqual(1, obj.a)
            self.assertEqual(2, obj.b)

            self.assertEqual({ 'a' : 1, 'b' : 2 }, dict(obj))

            self.assertEqual({ 'a': 1,
                               'b': [1, 2, 3],
                               'c': { 'str' : 'goofy',
                                      'float' : 1.234,
                                      'obj' : { 'name': 'john doe' }},
                               'd': True,
                               'e': None },
                             convert(ctxt.eval("""var x =
                             { a: 1,
                               b: [1, 2, 3],
                               c: { str: 'goofy',
                                    float: 1.234,
                                    obj: { name: 'john doe' }},
                               d: true,
                               e: null }; x""")))

    def testDate(self):
        with JSContext() as ctxt:
            now1 = ctxt.eval("new Date();")

            self.assertTrue(now1)

            now2 = datetime.utcnow()

            delta = now2 - now1 if now2 > now1 else now1 - now2

            self.assertTrue(delta < timedelta(seconds=1))

            func = ctxt.eval("(function (d) { return d.toString(); })")

            now = datetime.now()

            self.assertTrue(str(func(now)).startswith(now.strftime("%a %b %d %Y %H:%M:%S")))

    def testUnicode(self):
        with JSContext() as ctxt:
            self.assertEqual("人", toUnicodeString(ctxt.eval("\"人\"")))
            self.assertEqual("é", toUnicodeString(ctxt.eval("\"é\"")))

            func = ctxt.eval("(function (msg) { return msg.length; })")

            self.assertEqual(2, func("测试"))

    def testClassicStyleObject(self):
        class FileSystemWarpper:
            @property
            def cwd(self):
                return os.getcwd()

        class Global:
            @property
            def fs(self):
                return FileSystemWarpper()

        with JSContext(Global()) as ctxt:
            self.assertEqual(os.getcwd(), ctxt.eval("fs.cwd"))

    def testRefCount(self):
        count = sys.getrefcount(None)

        class Global(JSClass):
            pass

        with JSContext(Global()) as ctxt:
            ctxt.eval("""
                var none = null;
            """)

            self.assertEqual(count+1, sys.getrefcount(None))

            ctxt.eval("""
                var none = null;
            """)

            self.assertEqual(count+1, sys.getrefcount(None))

    def testProperty(self):
        class Global(JSClass):
            def __init__(self, name):
                self._name = name
            def getname(self):
                return self._name
            def setname(self, name):
                self._name = name
            def delname(self):
                self._name = 'deleted'

            name = property(getname, setname, delname)

        g = Global('world')

        with JSContext(g) as ctxt:
            self.assertEqual('world', ctxt.eval("name"))
            self.assertEqual('flier', ctxt.eval("this.name = 'flier';"))
            self.assertEqual('flier', ctxt.eval("name"))
            self.assertTrue(ctxt.eval("delete name"))
            ###
            # FIXME replace the global object with Python object
            #
            #self.assertEqual('deleted', ctxt.eval("name"))
            #ctxt.eval("__defineGetter__('name', function() { return 'fixed'; });")
            #self.assertEqual('fixed', ctxt.eval("name"))

    def testGetterAndSetter(self):
        class Global(JSClass):
           def __init__(self, testval):
               self.testval = testval

        with JSContext(Global("Test Value A")) as ctxt:
           self.assertEqual("Test Value A", ctxt.locals.testval)
           ctxt.eval("""
               this.__defineGetter__("test", function() {
                   return this.testval;
               });
               this.__defineSetter__("test", function(val) {
                   this.testval = val;
               });
           """)
           self.assertEqual("Test Value A",  ctxt.locals.test)

           ctxt.eval("test = 'Test Value B';")

           self.assertEqual("Test Value B",  ctxt.locals.test)

    def testDestructor(self):
        import gc

        owner = self
        owner.deleted = False

        class Hello(object):
            def say(self):
                pass

            def __del__(self):
                owner.deleted = True

        def test():
            with JSContext() as ctxt:
                fn = ctxt.eval("(function (obj) { obj.say(); })")

                obj = Hello()

                self.assertTrue(2, sys.getrefcount(obj))

                fn(obj)

                self.assertTrue(3, sys.getrefcount(obj))

                del obj

        test()

        self.assertFalse(owner.deleted)

        JSEngine.collect()
        gc.collect()
        JSEngine.collect()

        self.assertTrue(owner.deleted)

    def testNullInString(self):
        with JSContext() as ctxt:
            fn = ctxt.eval("(function (s) { return s; })")

            self.assertEqual("hello \0 world", fn("hello \0 world"))

    def testLivingObjectCache(self):
        class Global(JSClass):
            i = 1
            b = True
            o = object()

        with JSContext(Global()) as ctxt:
            self.assertTrue(ctxt.eval("i == i"))
            self.assertTrue(ctxt.eval("b == b"))
            self.assertTrue(ctxt.eval("o == o"))

    def testNamedSetter(self):
        class Obj(JSClass):
            @property
            def p(self):
                return self._p

            @p.setter
            def p(self, value):
                self._p = value

        class Global(JSClass):
            def __init__(self):
                self.obj = Obj()
                self.d = {}
                self.p = None

        with JSContext(Global()) as ctxt:
            ctxt.eval("""
            x = obj;
            x.y = 10;
            x.p = 10;
            d.y = 10;
            """)
            self.assertEqual(10, ctxt.eval("obj.y"))
            self.assertEqual(10, ctxt.eval("obj.p"))
            self.assertEqual(10, ctxt.locals.d['y'])

    def testWatch(self):
        class Obj(JSClass):
            def __init__(self):
                self.p = 1

        class Global(JSClass):
            def __init__(self):
                self.o = Obj()

        with JSContext(Global()) as ctxt:
            ctxt.eval("""
            o.watch("p", function (id, oldval, newval) {
                return oldval + newval;
            });
            """)

            self.assertEqual(1, ctxt.eval("o.p"))

            ctxt.eval("o.p = 2;")

            self.assertEqual(3, ctxt.eval("o.p"))

            ctxt.eval("delete o.p;")

            self.assertEqual(None, ctxt.eval("o.p"))

            ctxt.eval("o.p = 2;")

            self.assertEqual(2, ctxt.eval("o.p"))

            ctxt.eval("o.unwatch('p');")

            ctxt.eval("o.p = 1;")

            self.assertEqual(1, ctxt.eval("o.p"))

    def testReferenceError(self):
        class Global(JSClass):
            def __init__(self):
                self.s = self

        with JSContext(Global()) as ctxt:
            self.assertRaises(ReferenceError, ctxt.eval, 'x')

            self.assertTrue(ctxt.eval("typeof(x) === 'undefined'"))

            self.assertTrue(ctxt.eval("typeof(String) === 'function'"))

            self.assertTrue(ctxt.eval("typeof(s.String) === 'undefined'"))

            self.assertTrue(ctxt.eval("typeof(s.z) === 'undefined'"))

    def testRaiseExceptionInGetter(self):
        class Document(JSClass):
            def __getattr__(self, name):
                if name == 'y':
                    raise TypeError()

                return JSClass.__getattr__(self, name)

        class Global(JSClass):
            def __init__(self):
                self.document = Document()

        with JSContext(Global()) as ctxt:
            self.assertEqual(None, ctxt.eval('document.x'))
            self.assertRaises(TypeError, ctxt.eval, 'document.y')

class TestMultithread(unittest.TestCase):
    def testLocker(self):
        self.assertFalse(JSLocker.active)
        self.assertFalse(JSLocker.locked)

        with JSLocker() as outter_locker:
            self.assertTrue(JSLocker.active)
            self.assertTrue(JSLocker.locked)

            self.assertTrue(outter_locker)

            with JSLocker() as inner_locker:
                self.assertTrue(JSLocker.locked)

                self.assertTrue(outter_locker)
                self.assertTrue(inner_locker)

                with JSUnlocker() as unlocker:
                    self.assertFalse(JSLocker.locked)

                    self.assertTrue(outter_locker)
                    self.assertTrue(inner_locker)

                self.assertTrue(JSLocker.locked)

        self.assertTrue(JSLocker.active)
        self.assertFalse(JSLocker.locked)

        locker = JSLocker()

        with JSContext():
            self.assertRaises(RuntimeError, locker.__enter__)
            self.assertRaises(RuntimeError, locker.__exit__, None, None, None)

        del locker

    def testMultiPythonThread(self):
        import time, threading

        class Global:
            count = 0
            started = threading.Event()
            finished = threading.Semaphore(0)

            def sleep(self, ms):
                time.sleep(ms / 1000.0)

                self.count += 1

        g = Global()

        def run():
            with JSContext(g) as ctxt:
                ctxt.eval("""
                    started.wait();

                    for (i=0; i<10; i++)
                    {
                        sleep(100);
                    }

                    finished.release();
                """)

        threading.Thread(target=run).start()

        now = time.time()

        self.assertEqual(0, g.count)

        g.started.set()
        g.finished.acquire()

        self.assertEqual(10, g.count)

        self.assertTrue((time.time() - now) >= 1)

    def testMultiJavascriptThread(self):
        import time, threading

        class Global:
            result = []

            def add(self, value):
                with JSUnlocker():
                    time.sleep(0.1)

                    self.result.append(value)

        g = Global()

        def run():
            with JSContext(g) as ctxt:
                ctxt.eval("""
                    for (i=0; i<10; i++)
                        add(i);
                """)

        threads = [threading.Thread(target=run), threading.Thread(target=run)]

        with JSLocker():
            for t in threads: t.start()

        for t in threads: t.join()

        self.assertEqual(20, len(g.result))

    def _testPreemptionJavascriptThreads(self):
        import time, threading

        class Global:
            result = []

            def add(self, value):
                # we use preemption scheduler to switch between threads
                # so, just comment the JSUnlocker
                #
                # with JSUnlocker() as unlocker:
                time.sleep(0.1)

                self.result.append(value)

        g = Global()

        def run():
            with JSContext(g) as ctxt:
                ctxt.eval("""
                    for (i=0; i<10; i++)
                        add(i);
                """)

        threads = [threading.Thread(target=run), threading.Thread(target=run)]

        with JSLocker() as locker:
            JSLocker.startPreemption(100)

            for t in threads: t.start()

        for t in threads: t.join()

        self.assertEqual(20, len(g.result))

class TestEngine(unittest.TestCase):
    def testClassProperties(self):
        with JSContext() as ctxt:
            self.assertTrue(str(JSEngine.version).startswith("3."))
            self.assertFalse(JSEngine.dead)

    def testCompile(self):
        with JSContext() as ctxt:
            with JSEngine() as engine:
                s = engine.compile("1+2")

                self.assertTrue(isinstance(s, _PyV8.JSScript))

                self.assertEqual("1+2", s.source)
                self.assertEqual(3, int(s.run()))

                self.assertRaises(SyntaxError, engine.compile, "1+")

    def testPrecompile(self):
        with JSContext() as ctxt:
            with JSEngine() as engine:
                data = engine.precompile("1+2")

                self.assertTrue(data)
                self.assertEqual(28, len(data))

                s = engine.compile("1+2", precompiled=data)

                self.assertTrue(isinstance(s, _PyV8.JSScript))

                self.assertEqual("1+2", s.source)
                self.assertEqual(3, int(s.run()))

                self.assertRaises(SyntaxError, engine.precompile, "1+")

    def testUnicodeSource(self):
        class Global(JSClass):
            var = '测试'

            def __getattr__(self, name):
                if (name if is_py3k else name.decode('utf-8')) == '变量':
                    return self.var

                return JSClass.__getattr__(self, name)

        g = Global()

        with JSContext(g) as ctxt:
            with JSEngine() as engine:
                src = """
                function 函数() { return 变量.length; }

                函数();

                var func = function () {};
                """

                data = engine.precompile(src)

                self.assertTrue(data)
                self.assertEqual(68, len(data))

                s = engine.compile(src, precompiled=data)

                self.assertTrue(isinstance(s, _PyV8.JSScript))

                self.assertEqual(toNativeString(src), s.source)
                self.assertEqual(2, s.run())

                func_name = toNativeString('函数')

                self.assertTrue(hasattr(ctxt.locals, func_name))

                func = getattr(ctxt.locals, func_name)

                self.assertTrue(isinstance(func, _PyV8.JSFunction))

                self.assertEqual(func_name, func.name)
                self.assertEqual("", func.resname)
                self.assertEqual(1, func.linenum)
                self.assertEqual(0, func.lineoff)
                self.assertEqual(0, func.coloff)

                var_name = toNativeString('变量')

                setattr(ctxt.locals, var_name, '测试长字符串')

                self.assertEqual(6, func())

                self.assertEqual("func", ctxt.locals.func.inferredname)

    def testExtension(self):
        extSrc = """function hello(name) { return "hello " + name + " from javascript"; }"""
        extJs = JSExtension("hello/javascript", extSrc)

        self.assertTrue(extJs)
        self.assertEqual("hello/javascript", extJs.name)
        self.assertEqual(extSrc, extJs.source)
        self.assertFalse(extJs.autoEnable)
        self.assertTrue(extJs.registered)

        TestEngine.extJs = extJs

        with JSContext(extensions=['hello/javascript']) as ctxt:
            self.assertEqual("hello flier from javascript", ctxt.eval("hello('flier')"))

        # test the auto enable property

        with JSContext() as ctxt:
            self.assertRaises(ReferenceError, ctxt.eval, "hello('flier')")

        extJs.autoEnable = True
        self.assertTrue(extJs.autoEnable)

        with JSContext() as ctxt:
            self.assertEqual("hello flier from javascript", ctxt.eval("hello('flier')"))

        extJs.autoEnable = False
        self.assertFalse(extJs.autoEnable)

        with JSContext() as ctxt:
            self.assertRaises(ReferenceError, ctxt.eval, "hello('flier')")

        extUnicodeSrc = """function helloW(name) { return "hello " + name + " from javascript"; }"""
        extUnicodeJs = JSExtension("helloW/javascript", extUnicodeSrc)

        self.assertTrue(extUnicodeJs)
        self.assertEqual("helloW/javascript", extUnicodeJs.name)
        self.assertEqual(toNativeString(extUnicodeSrc), extUnicodeJs.source)
        self.assertFalse(extUnicodeJs.autoEnable)
        self.assertTrue(extUnicodeJs.registered)

        TestEngine.extUnicodeJs = extUnicodeJs

        with JSContext(extensions=['helloW/javascript']) as ctxt:
            self.assertEqual("hello flier from javascript", ctxt.eval("helloW('flier')"))

            ret = ctxt.eval("helloW('世界')")

            self.assertEqual("hello 世界 from javascript", ret if is_py3k else ret.decode('UTF-8'))

    def testNativeExtension(self):
        extSrc = "native function hello();"
        extPy = JSExtension("hello/python", extSrc, lambda func: lambda name: "hello " + name + " from python", register=False)
        self.assertTrue(extPy)
        self.assertEqual("hello/python", extPy.name)
        self.assertEqual(extSrc, extPy.source)
        self.assertFalse(extPy.autoEnable)
        self.assertFalse(extPy.registered)
        extPy.register()
        self.assertTrue(extPy.registered)

        TestEngine.extPy = extPy

        with JSContext(extensions=['hello/python']) as ctxt:
            self.assertEqual("hello flier from python", ctxt.eval("hello('flier')"))

    def _testSerialize(self):
        data = None

        self.assertFalse(JSContext.entered)

        with JSContext() as ctxt:
            self.assertTrue(JSContext.entered)

            #ctxt.eval("function hello(name) { return 'hello ' + name; }")

            data = JSEngine.serialize()

        self.assertTrue(data)
        self.assertTrue(len(data) > 0)

        self.assertFalse(JSContext.entered)

        #JSEngine.deserialize()

        self.assertTrue(JSContext.entered)

        self.assertEqual('hello flier', JSContext.current.eval("hello('flier');"))

    def testEval(self):
        with JSContext() as ctxt:
            self.assertEqual(3, int(ctxt.eval("1+2")))

    def testGlobal(self):
        class Global(JSClass):
            version = "1.0"

        with JSContext(Global()) as ctxt:
            vars = ctxt.locals

            # getter
            self.assertEqual(Global.version, str(vars.version))
            self.assertEqual(Global.version, str(ctxt.eval("version")))

            self.assertRaises(ReferenceError, ctxt.eval, "nonexists")

            # setter
            self.assertEqual(2.0, float(ctxt.eval("version = 2.0")))

            self.assertEqual(2.0, float(vars.version))

    def testThis(self):
        class Global(JSClass):
            version = 1.0

        with JSContext(Global()) as ctxt:
            self.assertEqual("[object Global]", str(ctxt.eval("this")))

            self.assertEqual(1.0, float(ctxt.eval("this.version")))

    def testObjectBuildInMethods(self):
        class Global(JSClass):
            version = 1.0

        with JSContext(Global()) as ctxt:
            self.assertEqual("[object Global]", str(ctxt.eval("this.toString()")))
            self.assertEqual("[object Global]", str(ctxt.eval("this.toLocaleString()")))
            self.assertEqual(Global.version, float(ctxt.eval("this.valueOf()").version))

            self.assertTrue(bool(ctxt.eval("this.hasOwnProperty(\"version\")")))

            self.assertFalse(ctxt.eval("this.hasOwnProperty(\"nonexistent\")"))

    def testPythonWrapper(self):
        class Global(JSClass):
            s = [1, 2, 3]
            d = {'a': {'b': 'c'}, 'd': ['e', 'f']}

        g = Global()

        with JSContext(g) as ctxt:
            ctxt.eval("""
                s[2] = s[1] + 2;
                s[0] = s[1];
                delete s[1];
            """)
            self.assertEqual([2, 4], g.s)
            self.assertEqual('c', ctxt.eval("d.a.b"))
            self.assertEqual(['e', 'f'], ctxt.eval("d.d"))
            ctxt.eval("""
                d.a.q = 4
                delete d.d
            """)
            self.assertEqual(4, g.d['a']['q'])
            self.assertEqual(None, ctxt.eval("d.d"))

    def _testMemoryAllocationCallback(self):
        alloc = {}

        def callback(space, action, size):
            alloc[(space, action)] = alloc.setdefault((space, action), 0) + size

        JSEngine.setMemoryAllocationCallback(callback)

        with JSContext() as ctxt:
            self.assertFalse((JSObjectSpace.Code, JSAllocationAction.alloc) in alloc)

            ctxt.eval("var o = new Array(1000);")

            self.assertTrue((JSObjectSpace.Code, JSAllocationAction.alloc) in alloc)

        JSEngine.setMemoryAllocationCallback(None)

class TestDebug(unittest.TestCase):
    def setUp(self):
        self.engine = JSEngine()

    def tearDown(self):
        del self.engine

    events = []

    def processDebugEvent(self, event):
        try:
            logging.debug("receive debug event: %s", repr(event))

            self.events.append(repr(event))
        except:
            logging.error("fail to process debug event")
            logging.debug(traceback.extract_stack())

    def testEventDispatch(self):
        debugger = JSDebugger()

        self.assertTrue(not debugger.enabled)

        debugger.onBreak = lambda evt: self.processDebugEvent(evt)
        debugger.onException = lambda evt: self.processDebugEvent(evt)
        debugger.onNewFunction = lambda evt: self.processDebugEvent(evt)
        debugger.onBeforeCompile = lambda evt: self.processDebugEvent(evt)
        debugger.onAfterCompile = lambda evt: self.processDebugEvent(evt)

        with JSContext() as ctxt:
            debugger.enabled = True

            self.assertEqual(3, int(ctxt.eval("function test() { text = \"1+2\"; return eval(text) } test()")))

            debugger.enabled = False

            self.assertRaises(JSError, JSContext.eval, ctxt, "throw 1")

            self.assertTrue(not debugger.enabled)

        self.assertEqual(4, len(self.events))

class TestProfile(unittest.TestCase):
    def _testStart(self):
        self.assertFalse(profiler.started)

        profiler.start()

        self.assertTrue(profiler.started)

        profiler.stop()

        self.assertFalse(profiler.started)

    def _testResume(self):
        self.assertTrue(profiler.paused)

        self.assertEqual(profiler.Modules.cpu, profiler.modules)

        profiler.resume()

        profiler.resume(profiler.Modules.heap)

        # TODO enable profiler with resume
        #self.assertFalse(profiler.paused)


class TestAST(unittest.TestCase):

    class Checker(object):
        def __init__(self, testcase):
            self.testcase = testcase
            self.called = []

        def __enter__(self):
            self.ctxt = JSContext()
            self.ctxt.enter()

            return self

        def __exit__(self, exc_type, exc_value, traceback):
            self.ctxt.leave()

        def __getattr__(self, name):
            return getattr(self.testcase, name)

        def test(self, script):
            JSEngine().compile(script).visit(self)

            return self.called

        def onProgram(self, prog):
            self.ast = prog.toAST()
            self.json = json.loads(prog.toJSON())

            for decl in prog.scope.declarations:
                decl.visit(self)

            for stmt in prog.body:
                stmt.visit(self)

        def onBlock(self, block):
            for stmt in block.statements:
                stmt.visit(self)

        def onExpressionStatement(self, stmt):
            stmt.expression.visit(self)

            #print type(stmt.expression), stmt.expression

    def testBlock(self):
        class BlockChecker(TestAST.Checker):
            def onBlock(self, stmt):
                self.called.append('block')

                self.assertEqual(AST.NodeType.Block, stmt.type)

                self.assertTrue(stmt.initializerBlock)
                self.assertFalse(stmt.anonymous)

                target = stmt.breakTarget
                self.assertTrue(target)
                self.assertFalse(target.bound)
                self.assertTrue(target.unused)
                self.assertFalse(target.linked)

                self.assertEqual(2, len(stmt.statements))

                self.assertEqual(['%InitializeVarGlobal("i", 0);', '%InitializeVarGlobal("j", 0);'], [str(s) for s in stmt.statements])

        with BlockChecker(self) as checker:
            self.assertEqual(['block'], checker.test("var i, j;"))
            self.assertEqual("""FUNC
. NAME ""
. INFERRED NAME ""
. DECLS
. . VAR "i"
. . VAR "j"
. BLOCK INIT
. . CALL RUNTIME  InitializeVarGlobal
. . . LITERAL "i"
. . . LITERAL 0
. . CALL RUNTIME  InitializeVarGlobal
. . . LITERAL "j"
. . . LITERAL 0
""", checker.ast)
            self.assertEqual(['FunctionLiteral', {'name': ''},
                ['Declaration', {'mode': 'VAR'},
                    ['Variable', {'name': 'i'}]
                ], ['Declaration', {'mode':'VAR'},
                    ['Variable', {'name': 'j'}]
                ], ['Block',
                    ['ExpressionStatement', ['CallRuntime', {'name': 'InitializeVarGlobal'},
                        ['Literal', {'handle':'i'}],
                        ['Literal', {'handle': 0}]]],
                    ['ExpressionStatement', ['CallRuntime', {'name': 'InitializeVarGlobal'},
                        ['Literal', {'handle': 'j'}],
                        ['Literal', {'handle': 0}]]]
                ]
            ], checker.json)

    def testIfStatement(self):
        class IfStatementChecker(TestAST.Checker):
            def onIfStatement(self, stmt):
                self.called.append('if')

                self.assertTrue(stmt)
                self.assertEqual(AST.NodeType.IfStatement, stmt.type)

                self.assertEqual(7, stmt.pos)
                stmt.pos = 100
                self.assertEqual(100, stmt.pos)

                self.assertTrue(stmt.hasThenStatement)
                self.assertTrue(stmt.hasElseStatement)

                self.assertEqual("((value % 2) == 0)", str(stmt.condition))
                self.assertEqual("{ s = \"even\"; }", str(stmt.thenStatement))
                self.assertEqual("{ s = \"odd\"; }", str(stmt.elseStatement))

                self.assertFalse(stmt.condition.isPropertyName)

        with IfStatementChecker(self) as checker:
            self.assertEqual(['if'], checker.test("var s; if (value % 2 == 0) { s = 'even'; } else { s = 'odd'; }"))

    def testForStatement(self):
        class ForStatementChecker(TestAST.Checker):
            def onForStatement(self, stmt):
                self.called.append('for')

                self.assertEqual("{ j += i; }", str(stmt.body))

                self.assertEqual("i = 0;", str(stmt.init))
                self.assertEqual("(i < 10)", str(stmt.condition))
                self.assertEqual("(i++);", str(stmt.nextStmt))

                target = stmt.continueTarget

                self.assertTrue(target)
                self.assertFalse(target.bound)
                self.assertTrue(target.unused)
                self.assertFalse(target.linked)
                self.assertFalse(stmt.fastLoop)

            def onForInStatement(self, stmt):
                self.called.append('forIn')

                self.assertEqual("{ out += name; }", str(stmt.body))

                self.assertEqual("name", str(stmt.each))
                self.assertEqual("names", str(stmt.enumerable))

            def onWhileStatement(self, stmt):
                self.called.append('while')

                self.assertEqual("{ i += 1; }", str(stmt.body))

                self.assertEqual("(i < 10)", str(stmt.condition))

            def onDoWhileStatement(self, stmt):
                self.called.append('doWhile')

                self.assertEqual("{ i += 1; }", str(stmt.body))

                self.assertEqual("(i < 10)", str(stmt.condition))
                self.assertEqual(281, stmt.conditionPos)

        with ForStatementChecker(self) as checker:
            self.assertEqual(['for', 'forIn', 'while', 'doWhile'], checker.test("""
                var i, j;

                for (i=0; i<10; i++) { j+=i; }

                var names = new Array();
                var out = '';

                for (name in names) { out += name; }

                while (i<10) { i += 1; }

                do { i += 1; } while (i<10);
            """))

    def testCallStatements(self):
        class CallStatementChecker(TestAST.Checker):
            def onVariableDeclaration(self, decl):
                self.called.append('var')

                var = decl.proxy

                if var.name == 's':
                    self.assertEqual(AST.VarMode.var, decl.mode)

                    self.assertTrue(var.isValidLeftHandSide)
                    self.assertFalse(var.isArguments)
                    self.assertFalse(var.isThis)

            def onFunctionDeclaration(self, decl):
                self.called.append('func')

                var = decl.proxy

                if var.name == 'hello':
                    self.assertEqual(AST.VarMode.var, decl.mode)
                    self.assertTrue(decl.function)
                    self.assertEqual('(function hello(name) { s = ("Hello " + name); })', str(decl.function))
                elif var.name == 'dog':
                    self.assertEqual(AST.VarMode.var, decl.mode)
                    self.assertTrue(decl.function)
                    self.assertEqual('(function dog(name) { (this).name = name; })', str(decl.function))

            def onCall(self, expr):
                self.called.append('call')

                self.assertEqual("hello", str(expr.expression))
                self.assertEqual(['"flier"'], [str(arg) for arg in expr.args])
                self.assertEqual(159, expr.pos)

            def onCallNew(self, expr):
                self.called.append('callNew')

                self.assertEqual("dog", str(expr.expression))
                self.assertEqual(['"cat"'], [str(arg) for arg in expr.args])
                self.assertEqual(191, expr.pos)

            def onCallRuntime(self, expr):
                self.called.append('callRuntime')

                self.assertEqual("InitializeVarGlobal", expr.name)
                self.assertEqual(['"s"', '0'], [str(arg) for arg in expr.args])
                self.assertFalse(expr.isJsRuntime)

        with CallStatementChecker(self) as checker:
            self.assertEqual(['var', 'func', 'func', 'callRuntime', 'call', 'callNew'], checker.test("""
                var s;
                function hello(name) { s = "Hello " + name; }
                function dog(name) { this.name = name; }
                hello("flier");
                new dog("cat");
            """))

    def testTryStatements(self):
        class TryStatementsChecker(TestAST.Checker):
            def onThrow(self, expr):
                self.called.append('try')

                self.assertEqual('"abc"', str(expr.exception))
                self.assertEqual(66, expr.pos)

            def onTryCatchStatement(self, stmt):
                self.called.append('catch')

                self.assertEqual("{ throw \"abc\"; }", str(stmt.tryBlock))
                #FIXME self.assertEqual([], stmt.targets)

                stmt.tryBlock.visit(self)

                self.assertEqual("err", str(stmt.variable.name))
                self.assertEqual("{ s = err; }", str(stmt.catchBlock))

            def onTryFinallyStatement(self, stmt):
                self.called.append('finally')

                self.assertEqual("{ throw \"abc\"; }", str(stmt.tryBlock))
                #FIXME self.assertEqual([], stmt.targets)

                self.assertEqual("{ s += \".\"; }", str(stmt.finallyBlock))

        with TryStatementsChecker(self) as checker:
            self.assertEqual(['catch', 'try', 'finally'], checker.test("""
                var s;
                try {
                    throw "abc";
                }
                catch (err) {
                    s = err;
                };

                try {
                    throw "abc";
                }
                finally {
                    s += ".";
                }
            """))

    def testLiterals(self):
        class LiteralChecker(TestAST.Checker):
            def onCallRuntime(self, expr):
                expr.args[1].visit(self)

            def onLiteral(self, litr):
                self.called.append('literal')

                self.assertFalse(litr.isPropertyName)
                self.assertFalse(litr.isNull)
                self.assertFalse(litr.isTrue)

            def onRegExpLiteral(self, litr):
                self.called.append('regex')

                self.assertEqual("test", litr.pattern)
                self.assertEqual("g", litr.flags)

            def onObjectLiteral(self, litr):
                self.called.append('object')

                self.assertEqual('constant:"name"="flier",constant:"sex"=true',
                                  ",".join(["%s:%s=%s" % (prop.kind, prop.key, prop.value) for prop in litr.properties]))

            def onArrayLiteral(self, litr):
                self.called.append('array')

                self.assertEqual('"hello","world",42',
                                  ",".join([str(value) for value in litr.values]))
        with LiteralChecker(self) as checker:
            self.assertEqual(['literal', 'regex', 'literal', 'literal'], checker.test("""
                false;
                /test/g;
                var o = { name: 'flier', sex: true };
                var a = ['hello', 'world', 42];
            """))

    def testOperations(self):
        class OperationChecker(TestAST.Checker):
            def onUnaryOperation(self, expr):
                self.called.append('unaryOp')

                self.assertEqual(AST.Op.BIT_NOT, expr.op)
                self.assertEqual("i", expr.expression.name)

                #print "unary", expr

            def onIncrementOperation(self, expr):
                self.fail()

            def onBinaryOperation(self, expr):
                self.called.append('binOp')

                self.assertEqual(AST.Op.ADD, expr.op)
                self.assertEqual("i", str(expr.left))
                self.assertEqual("j", str(expr.right))
                self.assertEqual(36, expr.pos)

                #print "bin", expr

            def onAssignment(self, expr):
                self.called.append('assign')

                self.assertEqual(AST.Op.ASSIGN_ADD, expr.op)
                self.assertEqual(AST.Op.ADD, expr.binop)

                self.assertEqual("i", str(expr.target))
                self.assertEqual("1", str(expr.value))
                self.assertEqual(53, expr.pos)

                self.assertEqual("(i + 1)", str(expr.binOperation))

                self.assertTrue(expr.compound)

            def onCountOperation(self, expr):
                self.called.append('countOp')

                self.assertFalse(expr.prefix)
                self.assertTrue(expr.postfix)

                self.assertEqual(AST.Op.INC, expr.op)
                self.assertEqual(AST.Op.ADD, expr.binop)
                self.assertEqual(71, expr.pos)
                self.assertEqual("i", expr.expression.name)

                #print "count", expr

            def onCompareOperation(self, expr):
                self.called.append('compOp')

                if len(self.called) == 4:
                    self.assertEqual(AST.Op.EQ, expr.op)
                    self.assertEqual(88, expr.pos) # i==j
                else:
                    self.assertEqual(AST.Op.EQ_STRICT, expr.op)
                    self.assertEqual(106, expr.pos) # i===j

                self.assertEqual("i", str(expr.left))
                self.assertEqual("j", str(expr.right))

                #print "comp", expr

            def onConditional(self, expr):
                self.called.append('conditional')

                self.assertEqual("(i > j)", str(expr.condition))
                self.assertEqual("i", str(expr.thenExpr))
                self.assertEqual("j", str(expr.elseExpr))

                self.assertEqual(144, expr.thenExprPos)
                self.assertEqual(146, expr.elseExprPos)

        with OperationChecker(self) as checker:
            self.assertEqual(['binOp', 'assign', 'countOp', 'compOp', 'compOp', 'unaryOp', 'conditional'], checker.test("""
            var i, j;
            i+j;
            i+=1;
            i++;
            i==j;
            i===j;
            ~i;
            i>j?i:j;
            """))

    def testSwitchStatement(self):
        class SwitchStatementChecker(TestAST.Checker):
            def onSwitchStatement(self, stmt):
                self.called.append('switch')

                self.assertEqual('expr', stmt.tag.name)
                self.assertEqual(2, len(stmt.cases))

                case = stmt.cases[0]

                self.assertFalse(case.isDefault)
                self.assertTrue(case.label.isString)
                self.assertEqual(0, case.bodyTarget.pos)
                self.assertEqual(57, case.position)
                self.assertEqual(1, len(case.statements))

                case = stmt.cases[1]

                self.assertTrue(case.isDefault)
                self.assertEqual(None, case.label)
                self.assertEqual(0, case.bodyTarget.pos)
                self.assertEqual(109, case.position)
                self.assertEqual(1, len(case.statements))

        with SwitchStatementChecker(self) as checker:
            self.assertEqual(['switch'], checker.test("""
            switch (expr) {
                case 'flier':
                    break;
                default:
                    break;
            }
            """))

if __name__ == '__main__':
    if "-v" in sys.argv:
        level = logging.DEBUG
    else:
        level = logging.WARN

    if "-p" in sys.argv:
        sys.argv.remove("-p")
        print("Press any key to continue or attach process #%d..." % os.getpid())
        input()

    logging.basicConfig(level=level, format='%(asctime)s %(levelname)s %(message)s')

    logging.info("testing PyV8 module %s with V8 v%s", __version__, JSEngine.version)

    unittest.main()
