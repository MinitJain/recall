-- ============================================================
-- Recall — Row Level Security Policies
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE "Bookmark" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Collection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CollectionBookmark" ENABLE ROW LEVEL SECURITY;

-- ── Bookmark ─────────────────────────────────────────────────
CREATE POLICY "Users can view own bookmarks"
  ON "Bookmark" FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own bookmarks"
  ON "Bookmark" FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own bookmarks"
  ON "Bookmark" FOR UPDATE
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own bookmarks"
  ON "Bookmark" FOR DELETE
  USING (auth.uid()::text = "userId");

-- ── Tag (scoped through bookmark ownership) ──────────────────
CREATE POLICY "Users can view own tags"
  ON "Tag" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Bookmark"
      WHERE "Bookmark".id = "Tag"."bookmarkId"
        AND "Bookmark"."userId" = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert own tags"
  ON "Tag" FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Bookmark"
      WHERE "Bookmark".id = "Tag"."bookmarkId"
        AND "Bookmark"."userId" = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete own tags"
  ON "Tag" FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM "Bookmark"
      WHERE "Bookmark".id = "Tag"."bookmarkId"
        AND "Bookmark"."userId" = auth.uid()::text
    )
  );

-- ── Collection ───────────────────────────────────────────────
CREATE POLICY "Users can view own collections"
  ON "Collection" FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own collections"
  ON "Collection" FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own collections"
  ON "Collection" FOR UPDATE
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own collections"
  ON "Collection" FOR DELETE
  USING (auth.uid()::text = "userId");

-- ── CollectionBookmark (scoped through collection ownership) ──
CREATE POLICY "Users can view own collection bookmarks"
  ON "CollectionBookmark" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Collection"
      WHERE "Collection".id = "CollectionBookmark"."collectionId"
        AND "Collection"."userId" = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert own collection bookmarks"
  ON "CollectionBookmark" FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Collection"
      WHERE "Collection".id = "CollectionBookmark"."collectionId"
        AND "Collection"."userId" = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete own collection bookmarks"
  ON "CollectionBookmark" FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM "Collection"
      WHERE "Collection".id = "CollectionBookmark"."collectionId"
        AND "Collection"."userId" = auth.uid()::text
    )
  );
