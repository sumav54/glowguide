CREATE TABLE public.wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.wishlists TO authenticated;
GRANT ALL ON public.wishlists TO service_role;

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wishlist"
  ON public.wishlists FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own wishlist"
  ON public.wishlists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from own wishlist"
  ON public.wishlists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX wishlists_user_id_idx ON public.wishlists(user_id);