## Button API Integration Guide

#### Button iframe Documentation

We offer a convenient solution for webmasters looking to add YouTube downloading capability on their platforms. The Button API is straightforward and blends seamlessly into most websites. Below is a detailed guide on using this feature.

#### Prerequisites:

-   **A Website:** This guide presumes you have a functional website ready for integration.
-   **Basic HTML Understanding:** Knowing how to place code snippets within your site's structure will be crucial.

#### Parameters:

| Parameter | Description |
| --- | --- |
| url | The YouTube URL you want to download |
| f | The format you want to download the video in |
| color | The color you want the button to be |
| linkUrl | Your AD URL - 25% of all downloads will be redirected to your AD URL |
| css | Link to your custom CSS for the download button! Style the button any way you want! |

#### Steps to Integrate the Button API:

##### 1\. Familiarize with the API Endpoint

The primary API endpoint for this button feature is:

```
https://loader.to/api/button/?url=YOUR_YOUTUBE_VIDEO_URL&amp;f=FORMAT_VALUE&amp;color=COLOR_VALUE&amp;linkUrl=AD_URL&amp;css=CSS_URL
```

`YOUR_YOUTUBE_VIDEO_URL` is the URL of the YouTube video you want available for download. `FORMAT_VALUE` specifies the video format such as mp3, mp4, etc.

##### 2\. Place the Button on Your Site

Integrate the button by embedding the following iframe code:

```
&lt;iframe src="https://loader.to/api/button/?url=YOUR_YOUTUBE_VIDEO_URL&amp;f=FORMAT_VALUE&amp;color=COLOR_VALUE&amp;linkUrl=AD_URL&amp;css=CSS_URL" style="width:230px;height:60px;border:0;overflow:hidden;"&gt;&lt;/iframe&gt;
```

##### 3\. Customize the Button

The API provides customization settings for:

-   **color:** This determines the button's color (e.g., `#FF0000`).
-   **text:** This modifies the text shown on the button (e.g., `Download Video`).

Incorporate these into the API URL as shown:

```
&lt;iframe src="https://loader.to/api/button/?url=YOUR_YOUTUBE_VIDEO_URL&amp;f=FORMAT_VALUE&amp;color=COLOR_VALUE&amp;linkUrl=AD_URL&amp;css=CSS_URL&amp;color=COLOR_VALUE&amp;text=TEXT_VALUE" style="width:230px;height:60px;border:0;overflow:hidden;"&gt;&lt;/iframe&gt;
```

##### 4\. Test the Integration

After the integration, ensure:

-   Your web page showcases the button appropriately.
-   Pressing the button starts the video's download procedure.

##### 5\. Further Style Adjustments (If Needed)

Use CSS to further modify the iframe or adjust its positioning to fit your site's design.

The Button API provides a hassle-free method for site visitors to download YouTube content. Incorporating this tool elevates your platform's value, but it's essential to acknowledge copyright laws and adhere to terms of service when leveraging such integrations.

  

###### Formats

Formats
| Format | MP3 | M4A | WEBM Audio | AAC | FLAC | OPUS | OGG | WAV | MP4 360p | MP4 480p | MP4 720p | MP4 1080p | MP4 4K | MP4 8K |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Format String for URL | mp3 | m4a | webm\_audio | aac | flac | opus | ogg | wav | 360 | 480 | 720 | 1080 | 4k | 8k |
---
#### Download Endpoint

##### HTTP Method: GET

###### URL: https://loader.to/ajax/download.php

###### Query Parameters:

-   `format`: The file format to download. (required)
-   `url`: The encoded URL of the video. (required)
-   `api`: Your API key (required)

###### Request Example:

```
GET https://loader.to/ajax/download.php?format=mp3&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dabcd1234
```

###### Format Options

| Format Value | Format Description | Price per Download |
| --- | --- | --- |
| mp3 | MP3 Audio | $0.00015 |
| m4a | M4A Audio | $0.00010 |
| webm | WEBM Audio | $0.00015 |
| aac | AAC Audio | $0.00015 |
| flac | FLAC Audio | $0.00015 |
| opus | OPUS Audio | $0.00015 |
| ogg | OGG Audio | $0.00015 |
| vorbis | Vorbis Audio | $0.00015 |
| wav | WAV Audio | $0.00015 |
| 360 | MP4 Video (360p) | $0.00015 |
| 480 | MP4 Video (480p) | $0.00015 |
| 720 | MP4 Video (720p) | $0.00015 |
| 1080 | MP4 Video (1080p) | $0.00015 |
| 1440 | MP4 Video (1440p) | $0.00020 |
| 4k | WEBM Video (4K) | $0.00025 |
| 8k | WEBM Video (8K) | $0.00025 |

###### Response:

Returns a JSON object containing the download link and other metadata.

###### Response Properties:

-   `success`: A boolean value indicating the success of the download operation. If `true`, the download was successful; if `false`, there was an error.
-   `id`: A unique identifier for the download request. This ID can be used to query the progress of the download using the progress endpoint.
-   `content`: The Base64 encoded HTML content for the UI representation of the download. This content can be rendered to display the progress and download options to the user.
-   `info`: An object containing additional information about the downloaded content.

###### `info` Object Properties:

-   `image`: The URL of an image associated with the downloaded content. This image could be used as a thumbnail or preview for the downloaded content.
-   `title`: A title or description of the downloaded content. This could provide more context about what the content is, helping users identify their downloads.

###### Status Codes:

-   `200 OK`: Successful response.
-   `400 Bad Request`: Missing or invalid parameters.
-   `500 Internal Server Error`: Server error.

___

#### Progress Endpoint

##### HTTP Method: GET

###### URL: https://p.oceansaver.in/ajax/progress.php

###### Query Parameters:

-   `id`: The unique ID for the download. (required)

###### Request Example:

```
GET https://p.oceansaver.in/ajax/progress.php?id=abcd1234
```

###### Response:

Returns a JSON object containing the progress percentage and download URL if available.

###### Response Properties:

-   `progress`: Progress of the download in percentage. (0 to 1000; 1000 = 100%)
-   `download_url`: The URL to download the file. (optional)
-   `success`: Indicates if the operation was successful. 1 for success, 0 for failure.
-   `text`: Status of the Download in text

###### Response Example:

```
{
  "progress": 500,
  "success": 0,
  "download_url": null,
  "text": "Downloading"
}
```

###### Status Codes:

-   `200 OK`: Successful response.
-   `404 Not Found`: Invalid ID.
-   `500 Internal Server Error`: Server error.