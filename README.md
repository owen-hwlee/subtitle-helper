# Subtitle Helper

This is a simple application to assist music lovers and video creators in generating subtitle files with timestamp.

## Overview

This little project idea was formed because I love singing and want to record some songs with subtitles, which can be a lot of work if done manually line by line (I've suffered in school projects). I actually started developing this to procrastinate building [another website](https://www.github.com/owen-hwlee/taiwan-cycling-2024/) for my profile. Originally I estimated that this would take me one night tops to build, but sadly I was unable to speed run and ultimately wasted 2 more nights on this (which means 2 more nights not building my main project :)).

The following technologies were used:

- GitHub Actions
  - This allows me to customize deployment process for the website, even though this is extremely simple
- Code file minifiers ([terser](https://www.npmjs.com/package/terser), [clean-css-cli](https://www.npmjs.com/package/clean-css-cli), [html-minifier-terser](https://www.npmjs.com/package/html-minifier-terser))
  - Given the scale of this project, there is no actual need for minifying any of the code files
  - This is just an easy attempt at trying out minifiers
- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
  - This API allows users to interact with the YouTube video embed directly while modifying subtitles

This repository is public because I would like to host this for free on GitHub Pages (sadly I don't have a lot of spare cash).

## User Guide

Just follow these steps and you can create a `.lrc` subtitle file in no time!

Steps:

1. Copy the target YouTube video URL or video ID to the first input box and click the "Load Video" button.
   - Some videos might be copyrighted by media companies and other organizations, causing the video to not be viewable on this tool. Sorry if that's the case for you :(
2. Play the video to start timestamp tracking.
3. Scroll to / pause at your desired moments of the video.
4. Enter subtitles in the input box below the video, and click the "Add Line" button. One line of subtitles along with the current timestamp of the video will be added.
   - Adding more lines will add more rows to the subtitles list, automatically sorted by timestamp in ascending order
   - There is no validation on subtitle lines with duplicate timestamp (and honestly that is unlikely to happen anyway)
   - Clicking the "Delete Line" button will delete that line. Note that this action is irreversible
5. Click the "Preview `.lrc`" button to preview the generated `.lrc` subtitle file content.
6. Click the "Export to `.lrc`" button to download the file, and it's done!
   - Note that this button will export the exact same content as what the "Preview `.lrc`" button shows, and the preview textarea content will not be saved, so if any manual changes are made on the preview website, please save these changes yourself

## Future Work

If I ever decide to revisit this project, there are several possible upgrades I can perform:

- CSS styling (duh, the current UI looks a bit too minimalistic, only extremely basic RWD was implemented)
- SEO (duh, practice for actual web development)
  - `robots.txt` and some other methods, to be explored
- Highlight the subtitle line matching the current timestamp
  - Need to figure out whether event listeners can be configured on the time slider of the YouTube embed
- Add export functionality for `.srt` files, which is another commonly used subtitles format
  - However, `.srt` files include both start and end timestamps, which might not work well on the current UI and user workflow
