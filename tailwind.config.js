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
        // Tracker colors
        tracker: {
          sleep: "rgba(98, 95, 211, 1)",        // #625FD3
          water: "rgba(76, 195, 255, 1)",       // #4CC3FF
          mindfulness: "rgba(254, 142, 119, 1)", // #FE8E77
          steps: "rgba(255, 200, 86, 1)",       // #FFC856
          meals: "rgba(13, 201, 155, 1)",       // #0DC99B
          wellness: "rgba(225, 213, 185, 1)",   // #E1D5B9
        },
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
