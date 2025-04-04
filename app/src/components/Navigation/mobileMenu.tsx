// import { DropdownMenu, DropdownMenuContent,
//     DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
// import { Button } from '../ui/button';
// import { Menu } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuthStore } from '@/store/authStore';
    
//     const HamburgerMenu = () => {  
//         const { user, signOut } = useAuthStore();
//         const isAuthenticated = user ? true : false;
//         const navigate = useNavigate();
//         const dashboardText = () => {
//             switch (user?.role) {
//               case 'promoter':
//                 return 'Promoter Dashboard';
//               case 'club_owner':
//                 return 'Owner Dashboard';
//               default:
//                 return null;
//             }
//         }

//         return (
//             <div className='flex flex-row gap-4'>
//                 { !isAuthenticated && 
//                     (
//                         <Button 
//                             onClick={() => navigate('/login')}
//                             className="bg-navy hover:bg-bg-lightBlue">
//                             Log in
//                         </Button>
//                     )
//                 }
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         { isAuthenticated ? 
//                             (
//                                 <Button
//                                     variant="outline"
//                                     size="icon"
//                                     className="overflow-hidden rounded-full"
//                                 >
//                                     <img
//                                         src={'/male-avatar.png'}
//                                         width={36}
//                                         height={36}
//                                         alt="Avatar"
//                                         className="overflow-hidden rounded-full"
//                                     />
//                                 </Button>
//                             ) : 
//                             (
//                                 <Button variant="outline" size="icon">
//                                     <Menu className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all " />
//                                 </Button>
//                             )

//                         }
                        
//                     </DropdownMenuTrigger>
                    
//                         { isAuthenticated ? 
//                             (
//                                 <DropdownMenuContent align="end">
//                                     <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                                     <DropdownMenuSeparator />
//                                     <DropdownMenuItem>
//                                         <Link to="/clubs">
//                                             Clubs
//                                         </Link>
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem onClick={() => navigate('/dashboard')}>{dashboardText()}</DropdownMenuItem>
//                                     <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
//                                     <DropdownMenuItem>Support</DropdownMenuItem>
//                                     <DropdownMenuSeparator />
//                                     <DropdownMenuItem onClick={signOut}>Log out</DropdownMenuItem>
//                                 </DropdownMenuContent>
//                             ) :
//                             (
//                                 <DropdownMenuContent align="end">
//                                     <DropdownMenuItem>
//                                         <Link to="/">
//                                             Home
//                                         </Link>
//                                     </DropdownMenuItem>
//                                     {/* <DropdownMenuItem>
//                                         <Link to="/contact">
//                                             Contact Us
//                                         </Link>
//                                     </DropdownMenuItem> */}
//                                 </DropdownMenuContent>
//                             )
//                         }
//                 </DropdownMenu>
//             </div>
            
            
//         );
//     };
    
//     export default HamburgerMenu;
    