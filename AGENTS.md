<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Rules
- Training sessions use one public shared table with SELECT and INSERT access only; public UPDATE and DELETE are denied to prevent unauthenticated destructive changes.
- The home route renders the training log directly without session checks; the session form collects the coach name because accounts are not required.
- Preserve the original register as a same-origin embedded document, with a typed browser bridge for shared session reads and inserts; this retains its complete original UI without reintroducing account checks.
- Auxiliary original-register data stays device-local; do not publish the original bundled athlete roster, which contains children's personal details.
- Store original session details as versioned JSON in the existing notes column and decode legacy rows, preserving the existing shared table and denying shared updates/deletes.
- The embedded register loads its available categories and sections from a single browser-safe configuration, so every selector uses the same tested choices.
