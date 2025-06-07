
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Ban } from "lucide-react";
import { useAdminData } from "../hooks/useAdminData";
import { useToast } from "@/hooks/use-toast";

export const GroupManagement = () => {
  const { groups } = useAdminData();
  const { toast } = useToast();

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
            {groups.map((group) => (
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
                        handleGroupAction("view", group.id);
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
