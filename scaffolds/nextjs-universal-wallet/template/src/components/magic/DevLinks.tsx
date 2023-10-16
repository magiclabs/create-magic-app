import React from 'react';

interface Props {
  dark?: boolean;
  footer?: boolean;
}

const Links = ({ dark, footer }: Props) => {
  return (
    <div className={`links ${footer ? 'footer-links' : ''}`}>
      <div className={`link ${dark ? 'text-[#6851ff]' : 'text-[#fff]'}`}>
        <a href="https://magic.link/docs/home/welcome" target="_blank" rel="noreferrer">
          Dev Docs
        </a>
      </div>
      <div className={`link-divider ${dark ? 'bg-[#DDDBE0]' : 'bg-[#a270d3]'}`} />
      <div className={`link ${dark ? 'text-[#6851ff]' : 'text-[#fff]'}`}>
        <a href="https://dashboard.magic.link/signup" target="_blank" rel="noreferrer">
          Dashboard
        </a>
      </div>
      <div className={`link-divider ${dark ? 'bg-[#DDDBE0]' : 'bg-[#a270d3]'}`} />
      <div className={`link ${dark ? 'text-[#6851ff]' : 'text-[#fff]'}`}>
        <a href="https://discord.gg/magiclabs" target="_blank" rel="noreferrer">
          Discord
        </a>
      </div>
    </div>
  );
};

export default Links;
