import { useState, useEffect } from "react";
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
import { Plus, Users, Settings, MessageCircle, Search, Crown } from "lucide-react";
import { Group } from "@/types";
import { GroupChat } from "@/components/GroupChat";
import { GroupSettings } from "@/components/GroupSettings";
import { useToast } from "@/hooks/use-toast";
import { groupService } from "@/api/services/groups";
import { useAuth } from "@/contexts/AuthContext";

const createGroupSchema = z.object({
  name: z.string().min(2, { message: "Group name must be at least 2 characters" }),
  description: z.string().optional(),
});

export const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [currentView, setCurrentView] = useState<"list" | "chat" | "settings">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof createGroupSchema>>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Fetch groups on component mount
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const fetchedGroups = await groupService.getGroups();
      setGroups(fetchedGroups.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch groups",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof createGroupSchema>) => {
    try {
      const newGroup = await groupService.createGroup({
        name: values.name,
        description: values.description,
        isPrivate: false,
        members: []
      });

      setGroups([...groups, newGroup.data]);
      setIsCreateOpen(false);
      form.reset();

      toast({
        title: "Group created",
        description: `${values.name} has been created successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive",
      });
    }
  };

  const handleGroupChat = (group: Group) => {
    setSelectedGroup(group);
    setCurrentView("chat");
  };

  const handleGroupSettings = (group: Group) => {
    setSelectedGroup(group);
    setCurrentView("settings");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedGroup(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCreateGroupClick = () => {
    setIsCreateOpen(true);
  };

  const handleCancelCreate = () => {
    setIsCreateOpen(false);
    form.reset();
  };

  const handleUpdateGroup = async (updatedGroup: Group) => {
    try {
      const result = await groupService.updateGroup(updatedGroup.id, {
        name: updatedGroup.name,
        description: updatedGroup.description,
      });
      const updatedGroups = groups.map(g => g.id === result.data.id ? result.data : g);

      setGroups(updatedGroups);
      setCurrentView("list");

      toast({
        title: "Success",
        description: "Group updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update group",
        variant: "destructive",
      });
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (currentView === "chat" && selectedGroup) {
    return <GroupChat group={selectedGroup} onBack={handleBackToList} />;
  }

  if (currentView === "settings" && selectedGroup) {
    return (
      <GroupSettings
        group={selectedGroup}
        onBack={handleBackToList}
        onSave={handleUpdateGroup}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-primary">Loading groups...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 z-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Groups</h1>
          <p className="text-muted-foreground">Manage your group conversations</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateGroupClick}>
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
                        <Input placeholder="Enter group name" {...field} />
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
                        <Textarea placeholder="Describe your group" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={handleCancelCreate}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Group</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search groups..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-9"
        />
      </div>

      <div className="grid gap-4">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="hover:bg-accent/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={group.avatar} />
                    <AvatarFallback>{group.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {group.description || "No description"}
                    </CardDescription>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {group.members.length} members
                      </Badge>
                      {group.createdBy.id === user?.id && (
                        <Badge variant="outline" className="text-xs">
                          <Crown className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleGroupChat(group)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleGroupSettings(group)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
