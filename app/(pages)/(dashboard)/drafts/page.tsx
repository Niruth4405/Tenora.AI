import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";
import { redirect } from "next/navigation";

export default async function DraftsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const drafts = await prisma.contentDraft.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Saved Drafts</h1>
        <p className="text-sm text-gray-600 mt-2">
          Review the drafts generated from your raw updates before editing,
          approving, or scheduling them.
        </p>
      </div>

      {drafts.length === 0 ? (
        <div className="rounded border p-6 bg-gray-50">
          <p className="text-sm text-gray-700">
            No drafts saved yet. Generate content from the Create page and save
            the results to see them here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {drafts.map((draft) => (
            <article
              key={draft.id}
              className="rounded border p-5 space-y-4 bg-white"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{draft.platform}</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Created on{" "}
                    {new Date(draft.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <span className="inline-flex w-fit rounded border px-3 py-1 text-xs font-medium">
                  {draft.status}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Source Update</p>
                <div className="rounded border bg-gray-50 p-3">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {draft.sourceUpdate}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Generated Draft</p>
                <div className="rounded border bg-gray-50 p-3">
                  <pre className="whitespace-pre-wrap text-sm font-sans text-gray-800">
                    {draft.draft}
                  </pre>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Hashtags</p>
                <p className="text-sm text-gray-700">
                  {draft.hashtags.length > 0
                    ? draft.hashtags.join(", ")
                    : "none"}
                </p>
              </div>

              {draft.notes && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Notes</p>
                  <p className="text-sm text-gray-700">{draft.notes}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}