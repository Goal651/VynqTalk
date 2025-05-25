
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Users, Settings, MessageCircle, Search, UserPlus, Crown, MoreVertical } from "lucide-react";
import { Group } from "@/types";
import { GroupChat } from "@/components/GroupChat";
import { GroupSettings } from "@/components/GroupSettings";

const createGroupSchema = z.object({
  name: z.string().min(2, { message: "Group name must be at least 2 characters" }),
  description: z.string().optional(),
});

export const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "g1",
      name: "Team Alpha",
      avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=team-alpha",
      members: ["u1", "u2", "u3"],
      createdBy: "u1",
      createdAt: new Date(),
      description: "Main development team"
    },
    {
      id: "g2", 
      name: "Project Beta",
      avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=project-beta",
      members: ["u1", "u4"],
      createdBy: "u1",
      createdAt: new Date(),
      description: "Beta testing group"
    }
  ]);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [currentView, setCurrentView] = useState<"list" | "chat" | "settings">("list");
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<z.infer<typeof createGroupSchema>>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createGroupSchema>) => {
    console.log("Creating group with values:", values);
    const newGroup: Group = {
      id: `g${Date.now()}`,
      name: values.name,
      avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${values.name}`,
      members: ["current-user"],
      createdBy: "current-user",
      createdAt: new Date(),
      description: values.description,
    };
    setGroups([...groups, newGroup]);
    setIsCreateOpen(false);
    form.reset();
  };

  const handleGroupChat = (group: Group) => {
    console.log("Opening chat for group:", group.name);
    setSelectedGroup(group);
    setCurrentView("chat");
  };

  const handleGroupSettings = (group: Group) => {
    console.log("Opening settings for group:", group.name);
    setSelectedGroup(group);
    setCurrentView("settings");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedGroup(null);
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (currentView === "chat" && selectedGroup) {
    return <GroupChat group={selectedGroup} onBack={handleBackToList} />;
  }

  if (currentView === "settings" && selectedGroup) {
    return <GroupSettings group={selectedGroup} onBack={handleBackToList} onSave={(updatedGroup) => {
      setGroups(groups.map(g => g.id === updatedGroup.id ? updatedGroup : g));
      setCurrentView("list");
    }} />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Groups</h1>
          <p className="text-muted-foreground">Manage your group conversations</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter group name" 
                          {...field} 
                          className="cursor-text"
                          onChange={(e) => {
                            console.log("Group name input:", e.target.value);
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your group" 
                          {...field} 
                          className="cursor-text resize-none"
                          onChange={(e) => {
                            console.log("Group description input:", e.target.value);
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      console.log("Create group dialog cancelled");
                      setIsCreateOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="cursor-pointer">Create Group</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => {
              console.log("Search query:", e.target.value);
              setSearchQuery(e.target.value);
            }}
            className="pl-8 cursor-text"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <Avatar className="cursor-pointer">
                  <AvatarImage src={group.avatar} alt={group.name} />
                  <AvatarFallback>{group.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </div>
                <div className="flex items-center">
                  {group.createdBy === "current-user" && <Crown className="h-4 w-4 text-yellow-500" />}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary">{group.members.length} members</Badge>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGroupChat(group);
                    }}
                    className="cursor-pointer hover:bg-accent transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGroupSettings(group);
                    }}
                    className="cursor-pointer hover:bg-accent transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No groups found matching your search.</p>
        </div>
      )}
    </div>
  );
};
