import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";

export const socialLogins = [<%- socialLogin.reduce((a, b) => a ? `${a}, "${b}"` : `"${b}"`, "") %>];

export const magic = new Magic("<%= publicApiKey %>", {
  extensions: [new OAuthExtension()],
});
