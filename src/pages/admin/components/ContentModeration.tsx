
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Trash2 } from "lucide-react";
import { useAdminData } from "../hooks/useAdminData";
import { useToast } from "@/hooks/use-toast";

export const ContentModeration = () => {
  const { messages } = useAdminData();
  const { toast } = useToast();

  const handleContentAction = (action: string, messageId: string) => {
    console.log(`Content action: ${action} for message ${messageId}`);
    toast({
      title: "Content Action",
      description: `Successfully performed ${action} action on message ${messageId}`,
    });
  };

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/30">
      <CardHeader>
        <CardTitle>Content Moderation</CardTitle>
        <CardDescription>Review and moderate user-generated content</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id} className="cursor-pointer hover:bg-accent/30 transition-colors">
                <TableCell>{message.user}</TableCell>
                <TableCell className="max-w-xs truncate">{message.content}</TableCell>
                <TableCell>{message.timestamp}</TableCell>
                <TableCell>
                  <Badge variant={message.status === "approved" ? "default" : "destructive"}>
                    {message.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContentAction("view", message.id);
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
                        handleContentAction("delete", message.id);
                      }}
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
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
