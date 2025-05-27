
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Trash2, UserX, UserPlus, CheckCircle, Clock, Users } from "lucide-react";
import { useAdminData } from "../hooks/useAdminData";
import { AdminUser } from "../types";

export const UserManagement = () => {
  const { users, updateUser, deleteUser } = useAdminData();

  const handleUserAction = async (action: string, userId: string) => {
    console.log(`User action: ${action} for user ${userId}`);
    
    if (action === "block") {
      await updateUser(userId, { status: "blocked" });
    } else if (action === "enable") {
      await updateUser(userId, { status: "active" });
    } else if (action === "delete") {
      await deleteUser(userId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "blocked": return "destructive";
      case "suspended": return "secondary";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4" />;
      case "blocked": return <UserX className="h-4 w-4" />;
      case "suspended": return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Management
        </CardTitle>
        <CardDescription>Manage user accounts and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border/30">
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Messages</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="cursor-pointer hover:bg-accent/30 transition-colors border-border/20">
                <TableCell className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 border-2 border-border/30">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {user.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium">{user.name}</span>
                    <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(user.status)} className="flex items-center gap-1 w-fit">
                    {getStatusIcon(user.status)}
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.lastActive}</TableCell>
                <TableCell className="text-sm">{user.messageCount}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.joinDate}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUserAction("view", user.id);
                      }}
                      className="cursor-pointer hover:bg-accent/50 transition-colors h-8 w-8 p-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    
                    {user.status === "blocked" ? (
                      <Button type="button" 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserAction("enable", user.id);
                        }}
                        className="cursor-pointer hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/50 transition-colors h-8 w-8 p-0"
                      >
                        <UserPlus className="h-3 w-3" />
                      </Button>
                    ) : (
                      <Button type="button" 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserAction("block", user.id);
                        }}
                        className="cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors h-8 w-8 p-0"
                      >
                        <UserX className="h-3 w-3" />
                      </Button>
                    )}
                    
                    <Button type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUserAction("delete", user.id);
                      }}
                      className="cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
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
