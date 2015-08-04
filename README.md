# Introduction

This is an ionic application made for the [Direct Action Everywhere](http://www.directactioneverywhere.com) activist community.  It's goal is to facilitate the organization of actions and events done by this group.

# Supported platforms
iOS
Android
Browser

# Requirements
[Ionic](http://ionicframework.com)
[Cordova CLI](http://cordova.apache.org/docs/en/3.5.0/guide_cli_index.md.html)
[PhoneGap Facebook Plugin](https://github.com/Wizcorp/phonegap-facebook-plugin)

#Installation
##Source Code
Currently, it seems you must add the phonegap-facebook-plugin plugin manually.
See [ios installation guide](https://github.com/Wizcorp/phonegap-facebook-plugin/blob/master/platforms/ios/README.md)

If you did things correctly you should see a file in 'platforms/ios/Direct Action Everywhere/Direct Action Everywhere-Info.plist' containing the facebook ids.
e.g
```sh
platforms/ios$ grep -R 30915 *
Direct Action Everywhere/Direct Action Everywhere-Info.plist:    <string>630915116944951</string>
Direct Action Everywhere/Direct Action Everywhere-Info.plist:          <string>fb630915116944951</string>
```

## Download app/binary

This app is pending release on the Google play store.
In the mean time you can download a debug version from [phonegap](https://build.phonegap.com/apps/962836)
