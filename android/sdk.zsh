ANDROID_SDK_PATH=/Applications/android-sdk-macosx
if [[ -d $ANDROID_SDK_PATH ]]
then
	export ANDROID_SDK=$ANDROID_SDK_PATH
	export PATH=$PATH:$ANDROID_SDK_PATH/tools:$ANDROID_SDK_PATH/platform-tools
fi

