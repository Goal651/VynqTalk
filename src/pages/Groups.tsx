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
import { Group} from '@/types';
import { GroupChatView } from "@/components/chat/group/GroupChatView";
import { GroupSettings } from "@/components/GroupSettings";
import { useToast } from "@/hooks";
import { groupService } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const createGroupSchema = z.object({
  name: z.string().min(2, { message: "Group name must be at least 2 characters" }),
  description: z.string().optional(),
});

/**
 * Groups page for managing and joining group chats.
 * Handles group creation, search, chat, and settings views.
 */
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

  /**
   * Fetch groups from the backend and update state.
   */
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

  /**
   * Handle group creation form submission.
   * @param values - The form values for creating a group.
   */
  const onSubmit = async (values: z.infer<typeof createGroupSchema>) => {
    try {
      const newGroup = await groupService.createGroup({
        name: values.name,
        description: values.description,
        isPrivate: false
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

  /**
   * Set the selected group and switch to chat view.
   * @param group - The group to open chat for.
   */
  const handleGroupChat = (group: Group) => {
    setSelectedGroup(group);
    setCurrentView("chat");
  };

  /**
   * Set the selected group and switch to settings view.
   * @param group - The group to open settings for.
   */
  const handleGroupSettings = (group: Group) => {
    setSelectedGroup(group);
    setCurrentView("settings");
  };

  /**
   * Return to the group list view.
   */
  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedGroup(null);
  };

  /**
   * Update the search query for filtering groups.
   * @param e - The input change event.
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  /**
   * Open the create group dialog.
   */
  const handleCreateGroupClick = () => {
    setIsCreateOpen(true);
  };

  /**
   * Cancel group creation and reset the form.
   */
  const handleCancelCreate = () => {
    setIsCreateOpen(false);
    form.reset();
  };

  /**
   * Update a group and show a toast on success or error.
   * @param updatedGroup - The updated group object.
   */
  const handleUpdateGroup = async (updatedGroup: Group) => {
    try {
      const result = await groupService.updateGroup(updatedGroup.id, updatedGroup);
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
    return (
      <GroupChatView
        group={selectedGroup}
        users={groups.flatMap(group => group.members)}
        onBack={handleBackToList}
        onSettings={() => handleGroupSettings(selectedGroup)}
      />
    );
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
      <div className="p-2 sm:p-6 space-y-4 sm:space-y-6 z-20 lg:px-20 px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:px-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Groups</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Manage your group conversations</p>
          </div>
          <Button className="w-full sm:w-auto" size="sm" disabled>
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
        <div className="relative">
          <Skeleton className="h-10 w-full rounded mb-4" />
        </div>
        <div className="grid gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="hover:bg-accent/50 transition-colors">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-full" />
                    <div className="min-w-0">
                      <Skeleton className="h-4 w-32 mb-2 rounded" />
                      <Skeleton className="h-3 w-40 rounded" />
                      <div className="flex items-center space-x-2 mt-1">
                        <Skeleton className="h-4 w-20 rounded" />
                        <Skeleton className="h-4 w-16 rounded" />
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1 sm:space-x-2">
                    <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded" />
                    <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-6 space-y-4 sm:space-y-6 z-20 lg:px-20 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:px-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Groups</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Manage your group conversations</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleCreateGroupClick}
              className="w-full sm:w-auto"
              size="sm"
            >
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
          className="pl-9 text-sm py-2"
        />
      </div>

      <ScrollArea className="grid gap-3 sm:gap-4 h-[calc(100vh-180px)]">
        {filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Users className="h-10 w-10 mb-2" />
            <span>No groups found. Create your first group!</span>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <Card key={group.id} className="hover:bg-accent/50 transition-colors">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                      <AvatarImage src={group.avatar} />
                      <AvatarFallback>{group.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <CardTitle className="text-base sm:text-lg truncate">{group.name}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm truncate">
                        {group.description || "No description"}
                      </CardDescription>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] sm:text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {group.members.length} members
                        </Badge>
                        {group.createdBy.id === user?.id && (
                          <Badge variant="outline" className="text-[10px] sm:text-xs">
                            <Crown className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1 sm:space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleGroupChat(group)}
                      className="h-8 w-8 sm:h-10 sm:w-10"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleGroupSettings(group)}
                      className="h-8 w-8 sm:h-10 sm:w-10"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </ScrollArea>
    </div>
  );
};
