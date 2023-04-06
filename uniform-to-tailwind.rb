leading_seperator = "(?<=\\:|\\s|\\A)"
trailing_seperator = "(?=\\s|\\z)"

mapping = {
  # LEADING
  "leading-none": "leading-4",
  "leading-tight": "leading-4",
  "leading-snug": "leading-5",
  "leading-normal": "leading-6",
  "leading-relazed": "leading-7",
  "leading-loose": "leading-8",

  # TEXT
  "text-mono": "font-mono",
  "text-underline": "underline",
  "text-no-underline": "no-underline",
  "text-uppercase": "uppercase",
  "text-lowercase": "lowercase",
  "text-capitalize": "capitalize",
  "text-normal-case": "normal-case",
  "text-italic": "italic",
  "text-line-through": "line-through",
  "text-list-none": "list-none",
  "text-list-disc": "list-disc",
  "text-list-decimal": "list-decimal",
  "text-list-inside": "list-inside",
  "text-list-outside": "list-outside",
  "text-2x(?!l)": "text-3xl",
  "text-3x(?!l)": "text-5xl",
  "text-4x(?!l)": "text-6xl",
  "text-8x(?!l)": "text-9xl",
  "text-col-2": "[TODO:text-col-2]",
  "text-col-3": "[TODO:text-col-3]",
  "text-no-break": "break-inside-avoid-column",
  "text-break": "[TODO:text-break]",
  "text-nowrap": "whitespace-nowrap",
  "text-no-wrap": "whitespace-nowrap",
  "text-overflow-hidden": "truncate",
  "text-(hairline|thin|light|normal|medium|semibold|bold|extrabold|black)": "font-\\1",

  # MARGIN/PADDING
  "margin-nest": "[TODO:margin-nest]",
  "(border|margin|pad)-top": "\\1-t",
  "(border|margin|pad)-bottom": "\\1-b",
  "(border|margin|pad)-left": "\\1-l",
  "(border|margin|pad)-right": "\\1-r",
  "-h(\\-|\\s|\\z)": "-x\\1",
  "-v(\\-|\\s|\\z)": "-y\\1",
  "(margin|pad)-(t|b|l|r|x|y)": "\\1\\2",
  "(border|divide)(\\w\\-\\d)*px": "\\1\\2",
  "#{leading_seperator}(margin|pad|space|gap)(\\-?[t|b|l|r|x|y]?)-none": "\\1\\2-0",
  "#{leading_seperator}(margin|pad|space|gap)(\\-?[t|b|l|r|x|y]?)-1\\/4x": "\\1\\2-1",
  "#{leading_seperator}(margin|pad|space|gap)(\\-?[t|b|l|r|x|y]?)-1\\/2x": "\\1\\2-2",
  "#{leading_seperator}(margin|pad|space|gap)(\\-?[t|b|l|r|x|y]?)-3\\/4x": "\\1\\2-3",
  "#{leading_seperator}(margin|pad|space|gap)(\\-?[t|b|l|r|x|y]?)-xs": "\\1\\2-3",
  "#{leading_seperator}(margin|pad|space|gap)(\\-?[t|b|l|r|x|y]?)-sm": "\\1\\2-3.5",
  "#{leading_seperator}(margin|pad|space|gap)(\\-?[t|b|l|r|x|y]?)-lg": "\\1\\2-5",
  "#{leading_seperator}(margin|pad|space|gap)(\\-?[t|b|l|r|x|y]?)-xl": "\\1\\2-6",
  "#{leading_seperator}(margin|pad|space|gap)(\\-?[t|b|l|r|x|y]?)-2x": "\\1\\2-8",
  "#{leading_seperator}(margin|pad|space|gap)(\\-?[t|b|l|r|x|y]?)-4x": "\\1\\2-16",
  "#{leading_seperator}(margin|pad|space|gap)(\\-?[t|b|l|r|x|y]?)-8x": "\\1\\2-32",
  "#{leading_seperator}(margin|pad)(t|b|l|r|x|y)(?=\\s|\\z)": "\\1\\2-4",
  "#{leading_seperator}margin(?=\\s|\\z)": "m-4",
  "#{leading_seperator}pad(?=\\s|\\z)": "p-4",
  "#{leading_seperator}margin": "m",
  "#{leading_seperator}pad": "p",

  # SIZE
  "width": "w",
  "height": "h",
  "w-100-vw": "w-screen",
  "h-100-vh": "h-screen",
  "([wh]-[\\w\\d\\-]*(?:vh|vw|px))": "[TODO:\\1]",

  # MISC
  "(?<!\\s\\-)(gray|green|blue|red|yellow|purple|sand|midnight|space|ocean)(-\\d\\d)#{trailing_seperator}": '\1\+0',
  "(?<!\\s\\-)(gray|green|blue|red|yellow|purple|sand|midnight|space|ocean)-050#{trailing_seperator}": '\+-50',
  "hide": "hidden",
  "#{leading_seperator}rounded-xs(?=\\s|\\z)": "[TODO:rounded-xs]",
  "#{leading_seperator}square(?=\\s|\\z)": "rounded-none",
  "#{leading_seperator}rounded-2xl(?=\\s|\\z)": "rounded-2xl",
  "#{leading_seperator}rounded-3xl(?=\\s|\\z)": "rounded-3xl",
  "#{leading_seperator}round(?=\\s|\\z)": "rounded-full",

  "stroke-sm": "[TODO:stroke-sm]",
  "stroke-lg": "[TODO:stroke-lg]",
  "stroke-3x": "[TODO:stroke-3x]",
  "stroke-md": "stroke-1",
  "stroke-2x": "stroke-2",
  "stroke-none": "stroke-0",

  "bg-none": "bg-transparent",
  "bg-opacity": "[TODO:bg-opacity]",

  "position-fill": "inset-0",
  "position-(v|h)-center": "[TODO:position\\1-center]",
  "sticky-(top|bottom|right|left)": "sticky \\1-0",
  "z-\\d": "z-10",
  "z-(\\d)\\d+": 'z-\+0',

  "flex-fill": "flex-auto",
  "flex-initial": "[TODO:flex-initial/inherit]",
  "flex-none": "flex-initial",

  "shadow-xs": "shadow-sm",
  "shadow-inset": "shadow-inner",
  "shadow-inline": "[TODO:shadow-inline]",
  "shadow-outline": "[TODO:shadow-outline]",
  "shadow-opacity-(\\d*)": "[TODO:shadow-opacity-\\1]",


  "placeholder-": "placeholder:text-",

  "#{leading_seperator}justify-(?!content)": "justify-items-",
  "#{leading_seperator}justify-content-": "justify-",
  "align-(?!content)": "items-",
  "align-content-": "content-",
  "cols-": "grid-cols-(?!=fit|fil)",
  "cols-(fit|fill)([^\\s]*)": "[TODO:cols-\\1\\2]",
  "rows-": "grid-rows-",
  "transition-(\\d*)": "duration-\\1",
}

Dir.glob('app/**/*.{erb,ejx,js,html}').each do |path|
  body = File.read(path)
  body.gsub!(/((?:class[\=|\:]|classList\.(?:add|remove|toggle)\()[\'|\"])([^\'|\"]*)([\'|\"])/) {
    start_string = $1
    class_string = $2
    end_string = $3
    mapping.each do |pattern, replacement|
      class_string.gsub!(Regexp.new(pattern.to_s), replacement)
    end

    [start_string, class_string, end_string].join("")
  }
  File.write(path, body)
end

scss_mapping = {
  "color\\(['\"](\\w+)\\-(\\d+)['\"]\\)": "theme(colors.\\1.\\+0)",
  "color\\(['\"](\\w+)['\"]\\)": "theme(colors.\\1)"
}

Dir.glob('app/**/*.scss').each do |path|
  body = File.read(path)
  scss_mapping.each do |pattern, replacement|
    body.gsub!(Regexp.new(pattern.to_s), replacement)
  end
  File.write(path, body)
end