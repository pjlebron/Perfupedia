"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SeoFieldsProps {
  metaTitle: string;
  metaDescription: string;
  onMetaTitleChange: (v: string) => void;
  onMetaDescriptionChange: (v: string) => void;
}

export default function SeoFields({ metaTitle, metaDescription, onMetaTitleChange, onMetaDescriptionChange }: SeoFieldsProps) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label>Meta title</Label>
          <span className="text-xs text-gray-400">{metaTitle.length}/60</span>
        </div>
        <Input
          value={metaTitle}
          onChange={(e) => onMetaTitleChange(e.target.value)}
          placeholder="Título para Google (se genera automáticamente si lo dejás vacío)"
          maxLength={70}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label>Meta description</Label>
          <span className="text-xs text-gray-400">{metaDescription.length}/155</span>
        </div>
        <Textarea
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          placeholder="Descripción para Google (se genera automáticamente si lo dejás vacío)"
          maxLength={165}
          rows={3}
        />
      </div>
    </>
  );
}
