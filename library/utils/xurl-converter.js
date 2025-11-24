// Strings that we use to detect supported platforms in a message
const CheckMessageXUrlString = "https://x.com/";
const CheckMessageTikTokUrlString = "https://www.tiktok.com/";
const CheckMessageInstaUrlString = "https://www.instagram.com/";

// Replacement base URLs that point to the "vx" mirror services
const UpdatedMessagXUrlString = "https://vxtwitter.com/";
const UpdatedMessagTiktokUrlString = "https://www.vxtiktok.com/";
const UpdatedMessagInstaUrlString = "https://www.vxinstagram.com/";

// List of URLs we currently check for with CheckUrl
// (TikTok is handled separately and not included here)
const CheckedUrls = [CheckMessageXUrlString, CheckMessageInstaUrlString];

/**
 * Check if a string contains any of the supported URL patterns.
 *
 * @param {string} string - The text content to check.
 * @returns {string|undefined} - The first matching URL pattern, or undefined if none.
 */
export const CheckUrl = (string) => {
  return CheckedUrls.find((x) => string.includes(x));
};

/**
 * Convert a message containing a social media URL into its "vx" equivalent.
 *
 * @param {string} string - Original message content.
 * @returns {string|undefined} - Converted URL string, or undefined if no match.
 */
export const ConvertMessageUrl = (string) => {
  if (!string) return;

  // X / Twitter → vxtwitter
  if (string.includes(CheckMessageXUrlString)) {
    return ConvertMessageXUrl(string);
  }

  // Instagram → vxinstagram
  if (string.includes(CheckMessageInstaUrlString)) {
    return ConvertMessageInstaUrl(string);
  }

  // TikTok → vxtiktok
  if (string.includes(CheckMessageTikTokUrlString)) {
    return ConvertMessageTiktokUrl(string);
  }
};

/**
 * Replace X/Twitter URL base with vxtwitter.
 */
const ConvertMessageXUrl = (string) => {
  return string.replace(CheckMessageXUrlString, UpdatedMessagXUrlString);
};

/**
 * Replace Instagram URL base with vxinstagram.
 */
const ConvertMessageInstaUrl = (string) => {
  return string.replace(
    CheckMessageInstaUrlString,
    UpdatedMessagInstaUrlString
  );
};

/**
 * Replace TikTok URL base with vxtiktok.
 */
const ConvertMessageTiktokUrl = (string) => {
  return string.replace(
    CheckMessageTikTokUrlString,
    UpdatedMessagTiktokUrlString
  );
};
