import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, UserX, UserPlus, CheckCircle, Clock, Users } from "lucide-react";
import { useAdminData } from "../hooks/useAdminData";
import { useIsMobile } from "@/hooks";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";

export const UserManagement = () => {
  const { users, updateUser, deleteUser } = useAdminData();
  const isMobile = useIsMobile();
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleUserAction = async (action: 'blocked' | 'active', userId: number) => {
    console.log(`User action: ${action} for user ${userId}`);

    await updateUser(userId, { status: action });

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
        {isMobile ? (
          <div className="flex flex-col gap-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/40 border border-border/20 cursor-pointer hover:bg-accent/30 transition-colors"
                onClick={() => { setSelectedUser(user); setModalOpen(true); }}
              >
                <Avatar className="h-12 w-12 border-2 border-border/30">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {user.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-base">{user.name}</div>
                  <Badge variant={getStatusColor(user.status)} className="flex items-center gap-1 w-fit mt-1">
                    {getStatusIcon(user.status)}
                    {user.status}
                  </Badge>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={e => { e.stopPropagation(); setSelectedUser(user); setModalOpen(true); }}
                  className="ml-auto"
                >
                  <Eye className="h-5 w-5" />
                </Button>
              </div>
            ))}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogContent>
                {selectedUser && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Avatar className="h-12 w-12 border-2 border-border/30">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {selectedUser.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{selectedUser.name}</span>
                      </DialogTitle>
                      <DialogDescription className="text-xs text-muted-foreground">ID: {selectedUser.id}</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-2">
                      <div className="text-sm"><b>Email:</b> {selectedUser.email}</div>
                      <div className="text-sm"><b>Status:</b> <Badge variant={getStatusColor(selectedUser.status)} className="inline-flex items-center gap-1">{getStatusIcon(selectedUser.status)}{selectedUser.status}</Badge></div>
                      <div className="text-sm"><b>Last Active:</b> {new Date(selectedUser.lastActive).toLocaleString()}</div>
                      <div className="text-sm"><b>Created At:</b> {new Date(selectedUser.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {selectedUser.status === "blocked" ? (
                        <Button type="button" size="sm" variant="outline" onClick={() => handleUserAction("active", selectedUser.id)}>
                          <UserPlus className="h-4 w-4 mr-1" /> Unblock
                        </Button>
                      ) : (
                        <Button type="button" size="sm" variant="outline" onClick={() => handleUserAction("blocked", selectedUser.id)}>
                          <UserX className="h-4 w-4 mr-1" /> Block
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/30">
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Created At</TableHead>
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
                  <TableCell className="text-sm text-muted-foreground">{new Date(user.lastActive).toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button type="button"
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                          setModalOpen(true);
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
                            handleUserAction("active", user.id);
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
                            handleUserAction("blocked", user.id);
                          }}
                          className="cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors h-8 w-8 p-0"
                        >
                          <UserX className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
