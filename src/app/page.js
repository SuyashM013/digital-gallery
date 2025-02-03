"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Link, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const mockArtworks = [
  {
    id: "1",
    title: "Abstract Harmony",
    description: "A vibrant exploration of color and form through abstract expressionism.",
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1000",
    artist: "Sarah Chen",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Urban Dreams",
    description: "A contemporary take on city life through mixed media.",
    imageUrl: "https://images.unsplash.com/photo-1586810724476-c294fb7ac01b?q=80&w=436&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    artist: "Marcus Rivera",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Trees of Life",
    description: "A vibrant exploration of color and form through abstract expressionism.",
    imageUrl: "https://images.unsplash.com/photo-1591779051696-1c3fa1469a79?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    artist: "Teodor Drobota",
    createdAt: new Date().toISOString(),
  },
];

export default function Home() {
  const [artworks, setArtworks] = useState(mockArtworks);
  const [isUploading, setIsUploading] = useState(false);
  const [newArtwork, setNewArtwork] = useState({
    title: "",
    description: "",
    artist: "",
    imageUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setNewArtwork(prev => ({ ...prev, imageUrl: objectUrl }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Validate inputs
      if (!newArtwork.title || !newArtwork.description || !newArtwork.artist) {
        throw new Error("Please fill in all required fields");
      }

      if (!newArtwork.imageUrl && !selectedFile) {
        throw new Error("Please provide an image URL or upload a file");
      }

      // Mock upload - in production, this would interact with Supabase
      const mockUpload = {
        id: String(artworks.length + 1),
        ...newArtwork,
        createdAt: new Date().toISOString(),
      };

      setArtworks([mockUpload, ...artworks]);
      setNewArtwork({
        title: "",
        description: "",
        artist: "",
        imageUrl: "",
      });
      setSelectedFile(null);
      setPreviewUrl("");
      toast.success("Artwork uploaded successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload artwork");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">

      <div className="w-fit bg-zinc-400/40 px-3 py-1 rounded-xl  transform -rotate-90 top-40 left-[-90px] fixed  z-2 shadow-md ">
        <h2 >Created by Suyash Mishra</h2>
      </div> 


      <main className="container mx-auto px-4 py-8 z-1">



        <h1 className="text-4xl font-bold text-center mb-8">Digital Art Gallery</h1>

        {/* Upload Form */}
        <Card className="mb-12 max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newArtwork.title}
                  onChange={(e) => setNewArtwork({ ...newArtwork, title: e.target.value })}
                  placeholder="Enter artwork title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newArtwork.description}
                  onChange={(e) => setNewArtwork({ ...newArtwork, description: e.target.value })}
                  placeholder="Describe your artwork"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="artist">Artist Name</Label>
                <Input
                  id="artist"
                  value={newArtwork.artist}
                  onChange={(e) => setNewArtwork({ ...newArtwork, artist: e.target.value })}
                  placeholder="Enter artist name"
                  required
                />
              </div>

              <Tabs defaultValue="file" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file">Upload File</TabsTrigger>
                  <TabsTrigger value="url">Image URL</TabsTrigger>
                </TabsList>
                <TabsContent value="file" className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="artwork">Upload Artwork</Label>
                    <Input
                      id="artwork"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {previewUrl && (
                      <div className="mt-4 relative aspect-video">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="rounded-lg object-cover w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="url">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={newArtwork.imageUrl}
                      onChange={(e) => setNewArtwork({ ...newArtwork, imageUrl: e.target.value })}
                      placeholder="Enter image URL"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Artwork
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((artwork) => (
            <Card key={artwork.id} className="overflow-hidden hover:scale-105 hover:shadow-lg transition-all">
              <div className="aspect-video relative">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="object-cover w-full h-full"
                />
              </div>

              <CardContent className="p-4">
                <h3 className="text-xl font-semibold mb-2">{artwork.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{artwork.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">By {artwork.artist}</span>
                  <span className="text-muted-foreground">
                    {new Date(artwork.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}