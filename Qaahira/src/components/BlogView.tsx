import React, { useState } from "react";
import { BlogPost } from "../types";
import { Clock, BookOpen, ArrowLeft, Heart, User, CheckCircle2 } from "lucide-react";

interface BlogViewProps {
  posts: BlogPost[];
}

export default function BlogView({ posts }: BlogViewProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (selectedPost) {
    return (
      <div className="max-w-2xl mx-auto pb-12 flex flex-col gap-6">
        
        {/* Back navigation */}
        <button
          onClick={() => setSelectedPost(null)}
          className="self-start text-xs font-semibold text-brand-600 hover:text-brand-500 uppercase tracking-wider flex items-center gap-1.5 transition"
          id="btn-blog-back-to-list"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Science Library
        </button>

        {/* Article image header */}
        <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-md">
          <img
            src={selectedPost.thumbnail_url}
            alt={selectedPost.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 z-10 text-white flex flex-col gap-1.5">
            <span className="font-mono text-[10px] text-accent-300 font-bold uppercase tracking-widest bg-brand-950/70 p-1 px-2.5 rounded-md self-start border border-brand-800/40">
              Dental Science Review
            </span>
            <h1 className="font-sans text-lg md:text-xl font-bold uppercase text-white leading-tight">
              {selectedPost.title}
            </h1>
          </div>
        </div>

        {/* Read Metadata */}
        <div className="flex flex-wrap items-center gap-6 border-b border-slate-150 pb-4 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-300" />
            <span>PUBLISHED ON: {new Date(selectedPost.published_at).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-slate-300" />
            <span>AUTHOR: Clinic Orthodontic Board</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-red-500" />
            <span>PATIENT REVIEWED: Peer Approved</span>
          </div>
        </div>

        {/* Text Body - parses basic Markdown headers and list */}
        <article className="prose prose-slate prose-sm font-sans text-xs text-slate-600 leading-relaxed flex flex-col gap-4">
          {selectedPost.content.split("\n\n").map((para, paraIdx) => {
            if (para.startsWith("###")) {
              return (
                <h3 key={paraIdx} className="font-sans font-extrabold text-slate-900 text-sm uppercase mt-4 border-b border-slate-100 pb-1 tracking-wider">
                  {para.replace("###", "").trim()}
                </h3>
              );
            }
            if (para.startsWith("-") || para.startsWith("*")) {
              return (
                <ul key={paraIdx} className="list-disc pl-5 flex flex-col gap-1.5">
                  {para.split("\n").map((li, liIdx) => (
                    <li key={liIdx} className="leading-relaxed">
                      {li.replace(/^[\s-*-]+/, "").trim()}
                    </li>
                  ))}
                </ul>
              );
            }
            // Bold highlights parsing helper
            return (
              <p key={paraIdx} className="leading-relaxed">
                {para}
              </p>
            );
          })}
        </article>

        {/* Safe checklist badge */}
        <div className="p-4 bg-emerald-50 rounded-2xl flex items-center gap-3 border border-emerald-100 mt-6 md:p-5">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs uppercase text-slate-800">Clinic Verified Fact Sheet</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Articles published in this portal are audited periodically by Dr. Youssef El-Masry and Qahira's technical dental board to maintain clinical validity.
            </p>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 pb-12">
      
      {/* Header introduction */}
      <div className="flex flex-col gap-2 max-w-xl">
        <span className="font-mono text-xs text-brand-600 uppercase tracking-wider">Education & Hygiene</span>
        <h2 className="font-sans text-3xl font-extrabold text-[#3d1210] tracking-tight uppercase">
          Dental Science Library
        </h2>
        <p className="font-sans text-xs text-slate-500 leading-relaxed">
          Read clinically researched essays detailing modern orthodontics mechanics, prosthetics implant longevity, and expert oral wellness instructions.
        </p>
      </div>

      {/* Grid of articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => {
          return (
            <div
              key={post.post_id}
              onClick={() => setSelectedPost(post)}
              className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm hover:shadow-md transition cursor-pointer flex flex-col gap-4"
            >
              
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 shadow-inner">
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-2.5 px-1.5 flex-1 justify-between">
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] text-accent-600 bg-accent-50 border border-accent-100 p-0.5 px-2 rounded font-bold uppercase tracking-wider self-start">
                    Oral Health Manual
                  </span>
                  <h3 className="font-sans font-bold text-[#3d1210] text-sm uppercase leading-tight tracking-wide hover:text-brand-600">
                    {post.title}
                  </h3>
                  <p className="font-sans text-[11px] text-slate-400 mt-0.5 font-mono">
                    PUBLISHED: {new Date(post.published_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-[11px] font-semibold text-brand-600 hover:text-brand-500 uppercase tracking-wider flex items-center gap-1 pl-0.5 mt-2">
                  Read Article
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
