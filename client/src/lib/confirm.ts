"use client";

// One confirmation popup for every destructive action. Built on the native <dialog>, which
// already traps focus, closes on Esc and is announced as a modal by screen readers.
// Text is set with textContent, never HTML, so user data in messages can't inject markup.
export function confirmAction({
  title,
  body,
  confirmLabel = "Delete",
}: {
  title: string;
  body?: string;
  confirmLabel?: string;
}): Promise<boolean> {
  return new Promise((resolve) => {
    const dialog = document.createElement("dialog");
    dialog.className = "confirm-dialog";

    const heading = document.createElement("h2");
    heading.className = "confirm-title";
    heading.id = "confirm-title";
    heading.textContent = title;
    dialog.setAttribute("aria-labelledby", heading.id);
    dialog.append(heading);

    if (body) {
      const text = document.createElement("p");
      text.className = "confirm-body";
      text.id = "confirm-body";
      text.textContent = body;
      dialog.setAttribute("aria-describedby", text.id);
      dialog.append(text);
    }

    const actions = document.createElement("div");
    actions.className = "confirm-actions";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "confirm-cancel";
    cancel.textContent = "Cancel";
    const ok = document.createElement("button");
    ok.type = "button";
    ok.className = "confirm-ok";
    ok.textContent = confirmLabel;
    actions.append(cancel, ok);
    dialog.append(actions);

    let result = false;
    cancel.onclick = () => dialog.close();
    ok.onclick = () => {
      result = true;
      dialog.close();
    };
    // Clicking the dimmed backdrop (outside the box) cancels
    dialog.onclick = (e) => {
      if (e.target === dialog) dialog.close();
    };
    dialog.onclose = () => {
      dialog.remove();
      resolve(result);
    };

    document.body.append(dialog);
    dialog.showModal();
    cancel.focus(); // the safe choice is the default
  });
}
