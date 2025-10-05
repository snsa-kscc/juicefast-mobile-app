import React from "react";
import Svg, { Path, Ellipse } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const MailIcon: React.FC<IconProps> = ({
  width = 16,
  height = 16,
  color = "#929292",
}) => (
  <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.2493 8.47883L13.2533 6.44216C13.7207 6.12616 14 5.59883 14 5.03483V5.03483C14 4.09483 13.2387 3.3335 12.2993 3.3335H3.71068C2.77134 3.3335 2.01001 4.09483 2.01001 5.03416V5.03416C2.01001 5.59816 2.28934 6.1255 2.75668 6.44216L5.76068 8.47883C7.11601 9.3975 8.89401 9.3975 10.2493 8.47883V8.47883Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 5.03418V11.3335C2 12.4382 2.89533 13.3335 4 13.3335H12C13.1047 13.3335 14 12.4382 14 11.3335V5.03485"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const LockIcon: React.FC<IconProps> = ({
  width = 20,
  height = 20,
  color = "#929292",
}) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
    <Path
      d="M6.66663 8.33333V5.83333V5.83333C6.66663 3.9925 8.15913 2.5 9.99996 2.5V2.5C11.8408 2.5 13.3333 3.9925 13.3333 5.83333V5.83333V8.33333"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.1666 17.5002H5.83329C4.91246 17.5002 4.16663 16.7543 4.16663 15.8335V10.0002C4.16663 9.07933 4.91246 8.3335 5.83329 8.3335H14.1666C15.0875 8.3335 15.8333 9.07933 15.8333 10.0002V15.8335C15.8333 16.7543 15.0875 17.5002 14.1666 17.5002Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.50004 12.9511C7.49754 12.9511 7.49587 12.9527 7.49587 12.9552C7.49587 12.9577 7.49754 12.9594 7.50004 12.9594C7.50254 12.9594 7.50421 12.9577 7.50421 12.9552C7.50421 12.9527 7.50254 12.9511 7.50004 12.9511"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.0042 12.9511C10.0017 12.9511 10 12.9527 10 12.9552C10 12.9577 10.0025 12.9594 10.0042 12.9594C10.0067 12.9594 10.0084 12.9577 10.0084 12.9552C10.0084 12.9527 10.0067 12.9511 10.0042 12.9511"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.5 12.9511C12.4975 12.9511 12.4959 12.9527 12.4959 12.9552C12.4959 12.9577 12.4975 12.9594 12.5 12.9594C12.5025 12.9594 12.5042 12.9577 12.5042 12.9552C12.5042 12.9527 12.5025 12.9511 12.5 12.9511"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const UserIcon: React.FC<IconProps> = ({
  width = 16,
  height = 16,
  color = "#929292",
}) => (
  <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
    <Path
      d="M12 13.3333V12.8333C12 11.2685 10.7315 10 9.16671 10H4.16671C2.6019 10 1.33337 11.2685 1.33337 12.8333V13.3333"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Ellipse
      cx="6.66667"
      cy="4.66667"
      rx="2.66667"
      ry="2.66667"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.6 7.19984L12.4006 7.99984L13.7333 6.6665"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
