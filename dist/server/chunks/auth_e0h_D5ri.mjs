import "./db_CQD2SMMC.mjs";
async function getSessionUser(ctx) {
  try {
    return null;
  } catch (error) {
    console.error("Error getting session user:", error);
    return null;
  }
}
function requireUser(user) {
  if (!user) {
    const err = new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    throw err;
  }
}
export {
  getSessionUser as g,
  requireUser as r
};
