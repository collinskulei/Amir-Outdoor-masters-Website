"use client";

import { useEffect, useRef, useTransition } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { CharacterCount } from "@tiptap/extension-character-count";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Link2Off,
  ImagePlus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Minus,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadMedia } from "@/lib/actions/media";

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md text-pine-900/70 transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40",
        active && "bg-green-100 text-green-800"
      )}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, startUpload] = useTransition();

  function insertImage(file: File | undefined) {
    if (!file) return;
    const formData = new FormData();
    formData.set("file", file);
    startUpload(async () => {
      const result = await uploadMedia(formData, "blog");
      if (result.url) editor.chain().focus().setImage({ src: result.url, alt: "" }).run();
    });
  }

  function toggleLink() {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 p-1.5">
      <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton label="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton label="Add link" active={editor.isActive("link")} onClick={toggleLink}>
        <Link2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Remove link"
        disabled={!editor.isActive("link")}
        onClick={() => editor.chain().focus().unsetLink().run()}
      >
        <Link2Off className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Insert image" onClick={() => inputRef.current?.click()}>
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
      </ToolbarButton>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => insertImage(e.target.files?.[0])}
      />

      <div className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string, json: unknown, plainWordCount: number) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      ImageExtension.configure({ HTMLAttributes: { class: "rounded-lg" } }),
      Placeholder.configure({ placeholder: "Start writing your post..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      CharacterCount,
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-pine max-w-none min-h-[420px] px-5 py-4 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const words = editor.storage.characterCount?.words?.() ?? 0;
      onChange(editor.getHTML(), editor.getJSON(), words);
    },
  });

  const initialized = useRef(false);
  useEffect(() => {
    if (!editor || initialized.current) return;
    initialized.current = true;
    const words = editor.storage.characterCount?.words?.() ?? 0;
    onChange(editor.getHTML(), editor.getJSON(), words);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) {
    return <div className="min-h-[460px] animate-pulse rounded-xl border border-border bg-muted/30" />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <div className="border-t border-border px-5 py-2 text-xs text-muted-foreground">
        {editor.storage.characterCount?.words?.() ?? 0} words
      </div>
    </div>
  );
}
