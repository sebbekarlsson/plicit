import resolveConfig from "tailwindcss/resolveConfig";

// @ts-ignore
import flatten from "tailwindcss/lib/util/flattenColorPalette";

// @ts-ignore
import generatedColors from "tailwindcss/lib/public/colors";

import { theme } from "../../theme";

const fullConfig = resolveConfig({ content: [], theme: theme });

const th = fullConfig.theme.colors;
const flatPalette = flatten(th);

const m = generatedColors;
delete m["lightBlue"];
delete m["warmGray"];
delete m["trueGray"];
delete m["coolGray"];
delete m["blueGray"];

const defaultTheme = flatten(m);

export const getAppTheme = (): Record<string, string> => {
  return { ...flatPalette, ...defaultTheme };
};

const cache: Record<string, string> = {};

export const twColor = (classname: string): string => {
  if (cache[classname]) return cache[classname];

  const getKey = (classname: string) => {
    if (classname.startsWith("bg-") || classname.startsWith("text-")) {
      return classname.slice(classname.indexOf("-") + 1);
    }
    return classname;
  };

  const colors = getAppTheme();
  const classes = classname.includes(" ") ? classname.split(" ") : [classname];

  for (let i = 0; i < classes.length; i++) {
    const key = getKey(classes[i]);
    if (colors[key]) {
      cache[classname] = colors[key];
      return colors[key];
    }
  }

  return "";
};
