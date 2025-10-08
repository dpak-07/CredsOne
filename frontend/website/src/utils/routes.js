// central route constants
// src/utils/routes.js

/**
 * 🚦 Centralized route constants for the CredsOne app
 * Keeps all app paths consistent and avoids hardcoded strings throughout components.
 */

export const ROUTES = {
  // 🌍 Public Routes
  HOME: "/",
  VERIFY: "/verify",
  LOGIN: "/login",
  REGISTER: "/register",
  FAQ: "/faq",
  NOT_FOUND: "*",

  // 🎓 Learner Routes
  LEARNER_BASE: "/learner",
  LEARNER_HOME: "/learner",
  LEARNER_PROFILE: "/learner/profile",
  LEARNER_WALLET: "/learner/wallet",

  // 💼 Employer Routes
  EMPLOYER_BASE: "/employer",
  EMPLOYER_HOME: "/employer",
  EMPLOYER_SEARCH: "/employer/search",

  // 🏫 Institution Routes
  INSTITUTION_BASE: "/institution",
  INSTITUTION_HOME: "/institution",
  INSTITUTION_ISSUE: "/institution/issue",

  // 🧾 (Optional) Dynamic Credential View
  CREDENTIAL_VIEW: "/credential/:id",
};

/**
 * 🧭 Build dynamic route URLs with parameters.
 * Example:
 *   routeWithId(ROUTES.CREDENTIAL_VIEW, "CREDS-0001-2025")
 *   → "/credential/CREDS-0001-2025"
 */
export function routeWithId(routeTemplate, id) {
  if (!routeTemplate) return "";
  return routeTemplate.replace(":id", encodeURIComponent(String(id)));
}

/**
 * 🎭 Returns the dashboard base route for a given user role.
 * Useful for post-login redirects.
 *
 * @param {string} role - One of "learner" | "employer" | "institution"
 * @returns {string} Base path for that role, or "/" if unknown.
 */
export function roleBase(role) {
  if (!role) return ROUTES.HOME;
  switch (role.toLowerCase()) {
    case "learner":
      return ROUTES.LEARNER_BASE;
    case "employer":
      return ROUTES.EMPLOYER_BASE;
    case "institution":
      return ROUTES.INSTITUTION_BASE;
    default:
      return ROUTES.HOME;
  }
}

/**
 * ✅ Simple route grouping helper — use if you need
 * to dynamically map navigation or breadcrumbs later.
 */
export const ROUTE_GROUPS = {
  public: [
    ROUTES.HOME,
    ROUTES.VERIFY,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FAQ,
  ],
  learner: [
    ROUTES.LEARNER_HOME,
    ROUTES.LEARNER_PROFILE,
    ROUTES.LEARNER_WALLET,
  ],
  employer: [
    ROUTES.EMPLOYER_HOME,
    ROUTES.EMPLOYER_SEARCH,
  ],
  institution: [
    ROUTES.INSTITUTION_HOME,
    ROUTES.INSTITUTION_ISSUE,
  ],
};

export default ROUTES;
