export const Lufga = {
  thin: "Lufga-Thin",
  thinItalic: "Lufga-ThinItalic",
  extraLight: "Lufga-ExtraLight",
  extraLightItalic: "Lufga-ExtraLightItalic",
  light: "Lufga-Light",
  lightItalic: "Lufga-LightItalic",
  regular: "Lufga-Regular",
  italic: "Lufga-Italic",
  medium: "Lufga-Medium",
  mediumItalic: "Lufga-MediumItalic",
  semiBold: "Lufga-SemiBold",
  semiBoldItalic: "Lufga-SemiBoldItalic",
  bold: "Lufga-Bold",
  boldItalic: "Lufga-BoldItalic",
  extraBold: "Lufga-ExtraBold",
  extraBoldItalic: "Lufga-ExtraBoldItalic",
  black: "Lufga-Black",
  blackItalic: "Lufga-BlackItalic",
};

export const getFontFamily = (weight: keyof typeof Lufga) => Lufga[weight];
