const LIGHT_THEME_VARIABLES = {
  primaryColor: '#ffffff',
  primaryTextColor: '#202020',
  primaryBorderColor: '#d9d9d9',
  lineColor: '#838383',
  secondaryColor: '#f9f9f9',
  secondaryTextColor: '#202020',
  secondaryBorderColor: '#e0e0e0',
  tertiaryColor: '#f0f0f0',
  tertiaryTextColor: '#202020',
  tertiaryBorderColor: '#cecece',
  mainBkg: '#ffffff',
  nodeBorder: '#d9d9d9',
  clusterBkg: '#f9f9f9',
  clusterBorder: '#e0e0e0',
  edgeLabelBackground: '#ffffff',
  actorBkg: '#ffffff',
  actorBorder: '#d9d9d9',
  actorTextColor: '#202020',
  labelBoxBkgColor: '#ffffff',
  labelBoxBorderColor: '#d9d9d9',
  labelTextColor: '#202020',
};

const DARK_THEME_VARIABLES = {
  primaryColor: '#222325',
  primaryTextColor: '#ededf0',
  primaryBorderColor: '#48484f',
  lineColor: '#b0b0ba',
  secondaryColor: '#19191b',
  secondaryTextColor: '#ededf0',
  secondaryBorderColor: '#3a3a3e',
  tertiaryColor: '#2a2b2e',
  tertiaryTextColor: '#ededf0',
  tertiaryBorderColor: '#606068',
  mainBkg: '#222325',
  nodeBorder: '#48484f',
  clusterBkg: '#19191b',
  clusterBorder: '#3a3a3e',
  edgeLabelBackground: '#111113',
  actorBkg: '#222325',
  actorBorder: '#48484f',
  actorTextColor: '#ededf0',
  labelBoxBkgColor: '#222325',
  labelBoxBorderColor: '#48484f',
  labelTextColor: '#ededf0',
};

export function getMermaidTheme(theme: string | undefined) {
  return {
    theme: 'base' as const,
    themeVariables: theme === 'dark' ? DARK_THEME_VARIABLES : LIGHT_THEME_VARIABLES,
  };
}
