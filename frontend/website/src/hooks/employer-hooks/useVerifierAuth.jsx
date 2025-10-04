import useAuth from "../useAuth";

export function useVerifierAuth() {
  const { user, token, logout } = useAuth();

  const role = user?.role;

  return {
    verifier: user,
    orgName: user?.organization || "Your Organization",
    orgDid: user?.did || "did:example:org123",
    token,
    role,
    logout
  };
}
