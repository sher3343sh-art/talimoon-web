/**
 * The single source of truth for TALIMOON's official public communication
 * channels. Navbar and Footer both read from here so they can never drift
 * to different accounts.
 *
 * `SOCIAL` — the public profile pages (navbar icons + footer "Ijtimoiy
 * tarmoqlar"). `CONTACT` — the same brand as reachable channels for the
 * footer "Aloqa" column; note Instagram here is the DM deep-link
 * (`ig.me/m/...`), deliberately different from the public profile URL.
 *
 * Values are locale-independent. Any visible label wrapping them (column
 * headings, country names) stays in the component's own translation table.
 */

export const SOCIAL = {
  instagram: {
    url: "https://www.instagram.com/talimoon_/",
    handle: "@talimoon_",
  },
  telegram: {
    url: "https://t.me/Talimoon_DM",
    handle: "@Talimoon_DM",
  },
  youtube: {
    url: "https://www.youtube.com/@talimoonofficial",
    handle: "@talimoonofficial",
  },
} as const;

export const CONTACT = {
  email: {
    value: "hello@talimoon.com",
    href: "mailto:hello@talimoon.com",
  },
  telegram: {
    value: "@Talimoon_DM",
    href: "https://t.me/Talimoon_DM",
  },
  /** Instagram as a contact channel — opens a direct message, not the profile. */
  instagramDM: {
    value: "@talimoon_",
    href: "https://ig.me/m/talimoon_",
  },
  qatarPhone: {
    value: "+974 7747 2723",
    href: "tel:+97477472723",
  },
  uzbekistanPhone: {
    value: "+998 97 256 0020",
    href: "tel:+998972560020",
  },
} as const;
