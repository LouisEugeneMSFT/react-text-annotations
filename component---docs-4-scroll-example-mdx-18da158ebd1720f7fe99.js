(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{u9NO:function(t,n,o){"use strict";o.r(n),o.d(n,"_frontmatter",(function(){return m})),o.d(n,"default",(function(){return d}));var e=o("Fcif"),a=o("+I+c"),s=o("mXGw"),l=o("/FXl"),r=o("TjRS"),i=o("ZFoC"),c=o("3re2"),p=o("6eCA"),u=(o("aD51"),["components"]),m={};void 0!==m&&m&&m===Object(m)&&Object.isExtensible(m)&&!Object.prototype.hasOwnProperty.call(m,"__filemeta")&&Object.defineProperty(m,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"docs/4-scroll-example.mdx"}});var b={_frontmatter:m},f=r.a;function d(t){var n,o=t.components,d=Object(a.a)(t,u);return Object(l.b)(f,Object(e.a)({},b,d,{components:o,mdxType:"MDXLayout"}),Object(l.b)("h1",{id:"scroll-example"},"Scroll example"),Object(l.b)("p",null,"You can ask the component to automatically scroll to a specific location:"),Object(l.b)("ul",null,Object(l.b)("li",{parentName:"ul"},"scrollToFirstAnnotation is a boolean that will pick the first annotation when it exists."),Object(l.b)("li",{parentName:"ul"},"scrollToChar maps to a specific character offset. It has priority over the previous parameter and can give more control.")),Object(l.b)(i.c,{__position:0,__code:"() => {\n  const options = {\n    scrollToFirstAnnotation: true,\n    scrollToChar: null, // Try 2773 (the 2nd annotation)\n  }\n  const [annotations, setAnnotations] = React.useState(\n    sampleLongTextAnnotations,\n  )\n  const [relations, setRelations] = React.useState([])\n  return (\n    <Annotator\n      text={sampleLongText}\n      annotations={annotations}\n      relations={relations}\n      onChangeAnnotations={setAnnotations}\n      onChangeRelations={setRelations}\n      options={options}\n    />\n  )\n}",__scope:(n={props:d,DefaultLayout:r.a,Playground:i.c,Props:i.d,Annotator:c.a,sampleLongText:p.b,sampleLongTextAnnotations:p.c},n.DefaultLayout=r.a,n._frontmatter=m,n),mdxType:"Playground"},(function(){var t=s.useState(p.c),n=t[0],o=t[1],e=s.useState([]),a=e[0],r=e[1];return Object(l.b)(c.a,{text:p.b,annotations:n,relations:a,onChangeAnnotations:o,onChangeRelations:r,options:{scrollToFirstAnnotation:!0,scrollToChar:null},mdxType:"Annotator"})})))}void 0!==d&&d&&d===Object(d)&&Object.isExtensible(d)&&!Object.prototype.hasOwnProperty.call(d,"__filemeta")&&Object.defineProperty(d,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"docs/4-scroll-example.mdx"}}),d.isMDXComponent=!0}}]);
//# sourceMappingURL=component---docs-4-scroll-example-mdx-18da158ebd1720f7fe99.js.map