
'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast, ToastProvider } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { Bell, PlusCircle, Search, ChevronDown, ChevronRight, Star } from "lucide-react";

type Agent = { name: string; pinned: boolean };

export default function Page() {
  return (
    <ToastProvider>
      <GPTLibraryApp />
    </ToastProvider>
  )
}

function GPTLibraryApp() {
  const { toast } = useToast();

  const [userRole, setUserRole] = useState<"admin"|"user">("admin");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin"|"user">("user");
  const [users, setUsers] = useState<{name:string,email:string,role:"admin"|"user"}[]>([
    { name: "John Doe", email: "john@example.com", role: "user" },
    { name: "Jane Smith", email: "jane@example.com", role: "admin" },
  ]);
  const [confirmRemove, setConfirmRemove] = useState<string|null>(null);

  const coerceAgents = (raw:any): Agent[] => {
    if (Array.isArray(raw)) {
      if (raw.length===0) return [];
      if (typeof raw[0]==='string') return (raw as string[]).map(n=>({name:n,pinned:false}));
      if (typeof raw[0]==='object' && raw[0] && 'name' in raw[0]) return raw as Agent[];
    }
    return [{name:"Travel Deal AI", pinned:false},{name:"Tax Agent AI", pinned:false}];
  };

  const [agents, setAgents] = useState<Agent[]>(()=>{
    try { const s = localStorage.getItem("agents"); return s? coerceAgents(JSON.parse(s)) : [{name:"Travel Deal AI", pinned:false},{name:"Tax Agent AI", pinned:false}] } catch { return [{name:"Travel Deal AI", pinned:false},{name:"Tax Agent AI", pinned:false}] }
  });
  const [newAgentName, setNewAgentName] = useState("");
  const [confirmRemoveAgent, setConfirmRemoveAgent] = useState<string|null>(null);
  const [agentView, setAgentView] = useState<"grid"|"list">(()=>{ try{ return (localStorage.getItem("agentView") as any) || "grid" } catch { return "grid" } });
  const [dragIndex, setDragIndex] = useState<number|null>(null);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(()=>{ try{ localStorage.setItem("agents", JSON.stringify(agents)); } catch{} }, [agents]);
  useEffect(()=>{ try{ localStorage.setItem("agentView", agentView); } catch{} }, [agentView]);

  const initials = (name:string)=> name.split(" ").map(p=>p[0]).slice(0,2).join("").toUpperCase();

  const addAgentCommon = (raw:string) => {
    const name = raw.trim();
    if (!name) { toast({ title:"Action failed", description:"Please enter a valid name before adding an agent.", variant:"destructive" }); return false; }
    if (name.length > 50) { toast({ title:"Action failed", description:"Agent name cannot exceed 50 characters.", variant:"destructive" }); return false; }
    if (agents.some(a=>a.name.toLowerCase()===name.toLowerCase())) { toast({ title:"Action failed", description:"An agent with this name already exists.", variant:"destructive" }); return false; }
    setAgents([...agents, { name, pinned:false }]); toast({ title:"Agent added", description:`${name} has been added to your library.` }); return true;
  };

  const handleAddAgent = () => { if (addAgentCommon(newAgentName)) setNewAgentName(""); };
  const handleRemoveAgent = () => {
    if (confirmRemoveAgent) {
      setAgents(agents.filter(a=>a.name!==confirmRemoveAgent));
      toast({ title:"Agent removed", description:`${confirmRemoveAgent} has been deleted from your library.` });
      setConfirmRemoveAgent(null);
    } else {
      toast({ title:"Action failed", description:"No agent selected for removal.", variant:"destructive" });
    }
  };

  const togglePin = (name:string) => {
    setAgents(prev => prev.map(a=>a.name===name?{...a,pinned:!a.pinned}:a));
    const nowPinned = !agents.find(a=>a.name===name)?.pinned;
    toast({ title: nowPinned? "Pinned":"Unpinned", description: nowPinned? `${name} pinned to top.`:`${name} removed from pinned.` });
  };

  const displayAgents = [...agents.filter(a=>a.pinned), ...agents.filter(a=>!a.pinned)];
  const displayToOrigIndex = (di:number)=> agents.findIndex(a=>a.name===displayAgents[di].name);
  const onDragStart = (di:number)=> setDragIndex(di);
  const onDragOver = (e:React.DragEvent)=> e.preventDefault();
  const onDrop = (di:number)=> {
    if (dragIndex===null || dragIndex===di) return;
    const from = displayToOrigIndex(dragIndex);
    const to = displayToOrigIndex(di);
    setAgents(prev=>{
      const next=[...prev]; const [m]=next.splice(from,1); next.splice(to,0,m); return next;
    });
    setDragIndex(null);
    toast({ title:"Agent order updated", description:"Your agent layout has been saved." });
  };

  const [advSections, setAdvSections] = useState({ activity:false, quick:false, ui:false });
  const [advInfiniteScroll, setAdvInfiniteScroll] = useState(false);
  const [advRowsPerPage, setAdvRowsPerPage] = useState<25|50|100>(25);
  const [advQuickEdit, setAdvQuickEdit] = useState(true);
  useEffect(()=>{ try{ const s=localStorage.getItem("advSettingsState"); if(s){ const o=JSON.parse(s); o.sections && setAdvSections(o.sections); typeof o.infinite==="boolean" && setAdvInfiniteScroll(o.infinite); [25,50,100].includes(o.rowsPerPage) && setAdvRowsPerPage(o.rowsPerPage); typeof o.quickEdit==="boolean" && setAdvQuickEdit(o.quickEdit);} } catch{} },[]);
  useEffect(()=>{ try{ localStorage.setItem("advSettingsState", JSON.stringify({ sections:advSections, infinite:advInfiniteScroll, rowsPerPage:advRowsPerPage, quickEdit:advQuickEdit })) } catch{} }, [advSections,advInfiniteScroll,advRowsPerPage,advQuickEdit]);
  const toggleSection = (k: keyof typeof advSections)=> setAdvSections(s=>({...s,[k]:!s[k]}));
  const expandAll = ()=> setAdvSections({activity:true, quick:true, ui:true});
  const collapseAll = ()=> setAdvSections({activity:false, quick:false, ui:false});
  const resetDefaults = ()=> { setAdvSections({activity:false, quick:false, ui:false}); setAdvInfiniteScroll(false); setAdvRowsPerPage(25); setAdvQuickEdit(true); toast({ title:"Settings reset", description:"Advanced settings have been restored to defaults." }); };

  const handleAddUser = () => {
    if (newUserEmail) {
      setUsers([...users, { name: newUserEmail.split("@")[0], email: newUserEmail, role: newUserRole }]);
      toast({ title:"User added", description:`${newUserEmail} has been added as ${newUserRole}.` });
      setNewUserEmail(""); setNewUserRole("user");
    } else {
      toast({ title:"Action failed", description:"Please enter a valid email before adding a user.", variant:"destructive" });
    }
  };
  const handleRoleChange = (email:string, role:"admin"|"user") => {
    const updated = users.map(u=>u.email===email?{...u, role}:u);
    setUsers(updated);
    const changed = updated.find(u=>u.email===email);
    if (changed) toast({ title:"Role updated", description:`${changed.name} is now ${role}.` });
  };
  const confirmRemoveUser = (email:string)=> setConfirmRemove(email);
  const handleRemoveUser = ()=> {
    if (confirmRemove) {
      setUsers(users.filter(u=>u.email!==confirmRemove));
      toast({ title:"User removed", description:`${confirmRemove} has been removed successfully.` });
      setConfirmRemove(null);
    } else {
      toast({ title:"Action failed", description:"No user selected for removal.", variant:"destructive" });
    }
  };

  const SectionHeader = ({ open, onClick, title }: { open:boolean; onClick:()=>void; title:string }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between py-2">
      <span className="text-base font-semibold text-gray-800">{title}</span>
      {open ? <ChevronDown className="w-4 h-4"/> : <ChevronRight className="w-4 h-4"/>}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">AI Agent Library</h1>
        <div className="flex gap-2">
          <Input placeholder="Search GPTs..." className="w-64" />
          <Button><Search className="w-4 h-4 mr-1"/> Search</Button>
        </div>
      </header>

      <Tabs defaultValue="dashboard" className="mb-8">
        <TabsList>
          <TabsTrigger value="dashboard">👤 My Dashboard</TabsTrigger>
          <TabsTrigger value="roles">⚙️ User Roles</TabsTrigger>
          <TabsTrigger value="advanced">🔧 Advanced Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6 space-y-6">
          <Dialog>
            <Card>
              <CardContent className="p-5 flex flex-col items-center text-center">
                <Bell className="w-10 h-10 mb-2 text-gray-700"/>
                <h2 className="text-lg font-semibold">Scheduled Alerts</h2>
                <p className="text-sm text-gray-600 mb-4">Set up custom alerts from any GPT with your preferred frequency and format.</p>
                <DialogTrigger asChild>
                  <Button>Manage Alerts</Button>
                </DialogTrigger>
              </CardContent>
            </Card>
          </Dialog>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Your Agents</h2>
                <div className="flex items-center gap-2">
                  <Button variant={agentView==='grid'?'default':'outline'} onClick={()=>setAgentView('grid')}>Grid</Button>
                  <Button variant={agentView==='list'?'default':'outline'} onClick={()=>setAgentView('list')}>List</Button>
                </div>
              </div>

              <div className="flex space-x-2 mb-6">
                <Input placeholder="Enter agent name" value={newAgentName} onChange={(e)=>setNewAgentName(e.target.value)} />
                <Button onClick={handleAddAgent}><PlusCircle className="w-4 h-4 mr-1"/> Add Agent</Button>
              </div>

              {displayAgents.length===0 ? (
                <div className="text-sm text-gray-600">No agents yet — add your first AI below ✨</div>
              ) : agentView === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {displayAgents.map((agent, dIndex) => (
                    <div key={agent.name}
                      draggable
                      onDragStart={()=>onDragStart(dIndex)}
                      onDragOver={onDragOver}
                      onDrop={()=>onDrop(dIndex)}
                      className="group cursor-grab active:cursor-grabbing select-none"
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                              {initials(agent.name)}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="sm" variant="outline" onClick={()=>togglePin(agent.name)}>
                                <Star className={`w-4 h-4 ${agent.pinned ? 'text-yellow-500':''}`} />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={()=>setConfirmRemoveAgent(agent.name)}>Remove</Button>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-gray-800 mb-1">{agent.name}</div>
                          <div className="text-xs text-gray-500">{agent.pinned ? 'Pinned • ' : ''}Drag to reorder</div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  {displayAgents.map((agent, dIndex) => (
                    <li key={agent.name}
                      draggable
                      onDragStart={()=>onDragStart(dIndex)}
                      onDragOver={onDragOver}
                      onDrop={()=>onDrop(dIndex)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">{initials(agent.name)}</div>
                          <span className="text-sm font-medium">{agent.name}</span>
                          {agent.pinned && <span className="text-xs text-yellow-600 ml-2">(Pinned)</span>}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={()=>togglePin(agent.name)}>
                            <Star className={`w-4 h-4 ${agent.pinned ? 'text-yellow-500':''}`} />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={()=>setConfirmRemoveAgent(agent.name)}>Remove</Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <Button onClick={()=>setAddOpen(true)} className="fixed bottom-6 right-6 rounded-full h-12 w-12 p-0 shadow-lg" aria-label="Add Agent">
                <PlusCircle className="w-6 h-6" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <Card><CardContent className="p-5">
            <h2 className="text-lg font-semibold mb-4">User Role Management</h2>
            <table className="table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map((u,i)=>(
                  <tr key={i}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td className="flex gap-2">
                      <Select value={u.role} onValueChange={(val:any)=>handleRoleChange(u.email, val)}>
                        <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="destructive" onClick={()=>confirmRemoveUser(u.email)}>Remove</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 flex items-center gap-2">
              <Input placeholder="Enter email" value={newUserEmail} onChange={(e)=>setNewUserEmail(e.target.value)} />
              <Select value={newUserRole} onValueChange={(val:any)=>setNewUserRole(val)}>
                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddUser}>Add</Button>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Advanced Settings</h2>
            {advSections.activity && advSections.quick && advSections.ui ? (
              <Button variant="outline" onClick={()=>collapseAll()}>Collapse All</Button>
            ) : (
              <Button variant="outline" onClick={()=>expandAll()}>Expand All</Button>
            )}
          </div>

          <Card><CardContent className="p-4">
            <SectionHeader title="Activity History Settings" open={advSections.activity} onClick={()=>toggleSection('activity')} />
            {advSections.activity && (
              <div className="space-y-3 mt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Enable Infinite Scroll</div>
                    <div className="text-xs text-gray-600">Loads logs automatically when scrolling instead of pages.</div>
                  </div>
                  <Switch checked={advInfiniteScroll} onCheckedChange={setAdvInfiniteScroll} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Rows per page</div>
                    <div className="text-xs text-gray-600">Controls the number of log rows on each page.</div>
                  </div>
                  <Select value={String(advRowsPerPage)} onValueChange={(v:any)=>setAdvRowsPerPage(Number(v) as 25|50|100)}>
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-2">
                  <Button variant="outline" onClick={resetDefaults}>Reset to Default Settings</Button>
                </div>
              </div>
            )}
          </CardContent></Card>

          <Card><CardContent className="p-4">
            <SectionHeader title="Quick Edit Options" open={advSections.quick} onClick={()=>toggleSection('quick')} />
            {advSections.quick && (
              <div className="space-y-3 mt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Allow Quick Edit for Alerts & Agents</div>
                    <div className="text-xs text-gray-600">Inline editing for faster changes without opening the full editor.</div>
                  </div>
                  <Switch checked={advQuickEdit} onCheckedChange={setAdvQuickEdit} />
                </div>
              </div>
            )}
          </CardContent></Card>

          <Card><CardContent className="p-4">
            <SectionHeader title="UI Preferences" open={advSections.ui} onClick={()=>toggleSection('ui')} />
            {advSections.ui && (
              <div className="text-xs text-gray-600 mt-2">More appearance options coming soon.</div>
            )}
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!confirmRemove} onOpenChange={()=>setConfirmRemove(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Removal</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-600">Are you sure you want to remove this user?</p>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setConfirmRemove(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRemoveUser}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmRemoveAgent} onOpenChange={()=>setConfirmRemoveAgent(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Agent Removal</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-600">Are you sure you want to remove this agent?</p>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setConfirmRemoveAgent(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRemoveAgent}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Agent</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Agent name" value={newAgentName} onChange={(e)=>setNewAgentName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setAddOpen(false)}>Cancel</Button>
            <Button onClick={()=>{ if (addAgentCommon(newAgentName)) { setNewAgentName(""); setAddOpen(false); } }}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
