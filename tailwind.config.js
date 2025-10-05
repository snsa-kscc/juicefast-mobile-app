/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    fontFamily: {
      sans: ["Lufga-Regular", "system-ui", "sans-serif"],
      // Standard weight mappings to Lufga variants
      thin: ["Lufga-Thin"],
      extralight: ["Lufga-ExtraLight"],
      light: ["Lufga-Light"],
      normal: ["Lufga-Regular"],
      medium: ["Lufga-Medium"],
      semibold: ["Lufga-SemiBold"],
      bold: ["Lufga-Bold"],
      extrabold: ["Lufga-ExtraBold"],
      black: ["Lufga-Black"],
    },
    extend: {
      colors: {
        "jf-gray": "#F8F6EB",
      },
      fontFamily: {
        // Specific Lufga variants (including italics)
        "lufga-thin": ["Lufga-Thin"],
        "lufga-thin-italic": ["Lufga-ThinItalic"],
        "lufga-extralight": ["Lufga-ExtraLight"],
        "lufga-extralight-italic": ["Lufga-ExtraLightItalic"],
        "lufga-light": ["Lufga-Light"],
        "lufga-light-italic": ["Lufga-LightItalic"],
        lufga: ["Lufga-Regular"],
        "lufga-italic": ["Lufga-Italic"],
        "lufga-medium": ["Lufga-Medium"],
        "lufga-medium-italic": ["Lufga-MediumItalic"],
        "lufga-semibold": ["Lufga-SemiBold"],
        "lufga-semibold-italic": ["Lufga-SemiBoldItalic"],
        "lufga-bold": ["Lufga-Bold"],
        "lufga-bold-italic": ["Lufga-BoldItalic"],
        "lufga-extrabold": ["Lufga-ExtraBold"],
        "lufga-extrabold-italic": ["Lufga-ExtraBoldItalic"],
        "lufga-black": ["Lufga-Black"],
        "lufga-black-italic": ["Lufga-BlackItalic"],
      },
    },
  },
  plugins: [],
};
