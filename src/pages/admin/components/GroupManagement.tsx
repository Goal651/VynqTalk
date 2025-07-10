import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Ban } from "lucide-react";
import { useAdminData } from "../hooks/useAdminData";
import { useToast ,useIsMobile} from "@/hooks";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

export const GroupManagement = () => {
  const { groups, loading } = useAdminData();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleGroupAction = (action: string, groupId: number) => {
    console.log(`Group action: ${action} for group ${groupId}`);
    toast({
      title: "Group Action",
      description: `Successfully performed ${action} action on group ${groupId}`,
    });
  };

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/30">
      <CardHeader>
        <CardTitle>Group Management</CardTitle>
        <CardDescription>Manage chat groups and their settings</CardDescription>
      </CardHeader>
      <CardContent>
        {isMobile ? (
          <div className="flex flex-col gap-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/40 border border-border/20">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-2 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              ))
            ) : groups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Users className="h-10 w-10 mb-2" />
                <span>No groups found</span>
              </div>
            ) : (
              groups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/40 border border-border/20 cursor-pointer hover:bg-accent/30 transition-colors"
                  onClick={() => { setSelectedGroup(group); setModalOpen(true); }}
                >
                  <Avatar className="h-12 w-12 border-2 border-border/30">
                    <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${group.name}`} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {group.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-base">{group.name}</div>
                    <Badge variant={group.status === "active" ? "default" : "destructive"} className="flex items-center gap-1 w-fit mt-1">
                      {group.status}
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={e => { e.stopPropagation(); setSelectedGroup(group); setModalOpen(true); }}
                    className="ml-auto"
                  >
                    <Eye className="h-5 w-5" />
                  </Button>
                </div>
              ))
            )}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogContent>
                {selectedGroup && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Avatar className="h-12 w-12 border-2 border-border/30">
                          <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${selectedGroup.name}`} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {selectedGroup.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{selectedGroup.name}</span>
                      </DialogTitle>
                      <DialogDescription className="text-xs text-muted-foreground">ID: {selectedGroup.id}</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-2">
                      <div className="text-sm"><b>Members:</b> {selectedGroup.members.length}</div>
                      <div className="text-sm"><b>Status:</b> <Badge variant={selectedGroup.status === "active" ? "default" : "destructive"} className="inline-flex items-center gap-1">{selectedGroup.status}</Badge></div>
                      <div className="text-sm"><b>Created At:</b> {new Date(selectedGroup.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button type="button" size="sm" variant="outline" onClick={() => handleGroupAction("suspend", selectedGroup.id)}>
                        <Ban className="h-4 w-4 mr-1" /> Suspend
                      </Button>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-8 w-32 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20 rounded" /></TableCell>
                  </TableRow>
                ))
              ) : groups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    <Users className="h-10 w-10 mb-2 mx-auto" />
                    <div>No groups found</div>
                  </TableCell>
                </TableRow>
              ) : (
                groups.map((group) => (
                  <TableRow key={group.id} className="cursor-pointer hover:bg-accent/30 transition-colors">
                    <TableCell className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${group.name}`} />
                        <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span>{group.name}</span>
                    </TableCell>
                    <TableCell>{group.members.length}</TableCell>
                    <TableCell>{new Date(group.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={group.status === "active" ? "default" : "destructive"}>
                        {group.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button type="button" 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedGroup(group);
                            setModalOpen(true);
                          }}
                          className="cursor-pointer hover:bg-accent transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button type="button" 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGroupAction("suspend", group.id);
                          }}
                          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
