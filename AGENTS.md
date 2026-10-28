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
