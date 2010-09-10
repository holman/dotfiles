// Copyright 2010 Wincent Colaiuta. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice,
//    this list of conditions and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright notice,
//    this list of conditions and the following disclaimer in the documentation
//    and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

#include "match.h"
#include "matcher.h"

VALUE mCommandT         = 0; // module CommandT
VALUE cCommandTMatch    = 0; // class CommandT::Match
VALUE cCommandTMatcher  = 0; // class CommandT::Matcher

VALUE CommandT_option_from_hash(const char *option, VALUE hash)
{
    if (NIL_P(hash))
        return Qnil;
    VALUE key = ID2SYM(rb_intern(option));
    if (rb_funcall(hash, rb_intern("has_key?"), 1, key) == Qtrue)
        return rb_hash_aref(hash, key);
    else
        return Qnil;
}

void Init_ext()
{
    // module CommandT
    mCommandT = rb_define_module("CommandT");

    // class CommandT::Match
    cCommandTMatch = rb_define_class_under(mCommandT, "Match", rb_cObject);

    // methods
    rb_define_method(cCommandTMatch, "initialize", CommandTMatch_initialize, -1);
    rb_define_method(cCommandTMatch, "matches?", CommandTMatch_matches, 0);
    rb_define_method(cCommandTMatch, "to_s", CommandTMatch_to_s, 0);

    // attributes
    rb_define_attr(cCommandTMatch, "score", Qtrue, Qfalse); // reader: true, writer: false

    // class CommandT::Matcher
    cCommandTMatcher = rb_define_class_under(mCommandT, "Matcher", rb_cObject);

    // methods
    rb_define_method(cCommandTMatcher, "initialize", CommandTMatcher_initialize, -1);
    rb_define_method(cCommandTMatcher, "sorted_matches_for", CommandTMatcher_sorted_matchers_for, 2);
    rb_define_method(cCommandTMatcher, "matches_for", CommandTMatcher_matches_for, 1);
}
