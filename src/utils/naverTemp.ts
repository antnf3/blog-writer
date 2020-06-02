interface TemplateProps {
  type: number;
  title: string;
}
function getTemplate(params: TemplateProps) {
  const template: { [key: string]: any } = {
    type1: {
      title: `<blockquote class="se2_quote2" style="margin: 0px 0px 30px 13px; padding: 0px 8px 0px 16px; background: url(&quot;https://ssl.pstatic.net/static.se2/static/img/bg_quote2.gif&quot;) 0px 3px no-repeat; color: rgb(136, 136, 136);"><p><span style="font-size: 24pt; color: rgb(255, 108, 0);">${params.title}</span></p></blockquote>`,
    },
    type2: {
      title: `<blockquote class="se2_quote1" style="padding: 0px 8px; margin: 0px 15px 30px 20px; border-left: 2px solid rgb(204, 204, 204); color: rgb(136, 136, 136);"><p><span style="font-size: 24pt; color: rgb(217, 72, 15);">${params.title}</span></p></blockquote>`,
    },
  };

  return template[`type${params.type}`];
}

export default getTemplate;
