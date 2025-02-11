# Change Log - @bentley/imodeljs-markup

This log was last generated on Fri, 19 Jun 2020 14:10:03 GMT and should not be manually modified.

## 2.2.0
Fri, 19 Jun 2020 14:10:03 GMT

*Version update only*

## 2.1.0
Thu, 28 May 2020 22:48:59 GMT

### Updates

- Added flyover names for drawing tools such as polygon, line, rectangle, cloud, sketch etc to reduce redundant name 'Markup' from flyover label

## 2.0.0
Wed, 06 May 2020 13:17:49 GMT

### Updates

- #310568 Fix issues with loading previously created markup svg into a view with a different aspect ratio.
- #282930 Fix markup prompts.
- Upgrade to Rush 5.23.2
- Remove support for the iModel.js module system by no longer delivering modules.

## 1.14.1
Wed, 22 Apr 2020 19:04:00 GMT

*Version update only*

## 1.14.0
Tue, 31 Mar 2020 15:44:19 GMT

*Version update only*

## 1.13.0
Wed, 04 Mar 2020 16:16:31 GMT

*Version update only*

## 1.12.0
Wed, 12 Feb 2020 17:45:50 GMT

*Version update only*

## 1.11.0
Wed, 22 Jan 2020 19:24:12 GMT

### Updates

- Upgrade to TypeScript 3.7.2.

## 1.10.0
Tue, 07 Jan 2020 19:44:01 GMT

*Version update only*

## 1.9.0
Tue, 10 Dec 2019 18:08:56 GMT

*Version update only*

## 1.8.0
Fri, 22 Nov 2019 14:03:34 GMT

### Updates

- Added missing topic descriptions

## 1.7.0
Fri, 01 Nov 2019 13:28:37 GMT

### Updates

- MarkerSet applies only to a single ScreenViewport

## 1.6.0
Wed, 09 Oct 2019 20:28:42 GMT

### Updates

- Tool assistance for markup tools
- Fixes for getting image from readMarkup

## 1.5.0
Mon, 30 Sep 2019 22:28:48 GMT

### Updates

- Added missing iconSpec to measure and clipping tools.
- Correct ViewClipByPlaneTool icon.
- Upgrade to TypeScript 3.6.2

## 1.4.0
Tue, 10 Sep 2019 12:09:49 GMT

### Updates

- Fixed prompts for the text and select markup tools.

## 1.3.0
Tue, 13 Aug 2019 20:25:53 GMT

### Updates

- Added icons and fixed prompt issue
- Added icon for redline text tool

## 1.2.0
Wed, 24 Jul 2019 11:47:26 GMT

### Updates

- Add stroke-dasharray to draw lines with dashes in markup

## 1.1.0
Mon, 01 Jul 2019 19:04:29 GMT

### Updates

- Fix for broken build from svg.js
- Clear flashed element (if it's selected) before deleting or adding to group.
- Lock to version 3.0.13 of svg.js package
- Support drag box selection for markup. Support multiselect of markup using touch input.
- Use left/right direction for inside/overlap selection to match element select tool and to support touch move.
- Update to TypeScript 3.5

## 1.0.0
Mon, 03 Jun 2019 18:09:39 GMT

### Updates

- point/vector coverage.
- Make MarkupApp.initialize public
- Added tests
- Improve touch interaction with markup handles.

## 0.191.0
Mon, 13 May 2019 15:52:05 GMT

### Breaking changes

- publish markup package

### Updates

- Add semver of imodeljs-markup to module/version map
- Fix .npmignore
- Preserve relative z order when grouping markup. Change default arrow direction.
- Documentation cleanup
- Allow editing of existing markups
- Allow editing of boxed text
- Added markup distance measure tool. Fixed groupAll.
- Add beta release tags for markup package.
- Don't use ctrl+f for bring to front shortcut
- Can now sub-class Markup SelectTool, test code to start redline tools from key event moved to display-test-app. Added place markup symbol tool.
- Upgrade TypeDoc dependency to 0.14.2

