// import {
//     NavigationMenu,
//     NavigationMenuItem,
//     NavigationMenuLink,
//     NavigationMenuList,
//     navigationMenuTriggerStyle,
//   } from "@/components/ui/navigation-menu"
//   import * as React from "react"
//   import { cn } from "@/lib/utils"
//   import { Link, useNavigate } from "react-router-dom"
//   import HamburgerMenu from "./mobileMenu"
//   import { Button } from "../ui/button"
// import { Separator } from "../ui/separator"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"

  
// function Navigation() {
//   const navigate = useNavigate();
//   // Your logic for deciding the logo based on the theme
//   // const logo = '/logo.png';//effectiveTheme != 'light' ? lightLogo : darkLogo;
  
//       return (
//         <div className="w-full pb-[2rem]">
//           <div className="flex justify-between items-center">
//             {/* Logo Section */}
//             <div className="flex items-center space-x-2">
//               <Link to="/" className="flex items-center space-x-2">
//                 Waitlisted
//               </Link>
//             </div>
//             <div className="hidden sm:flex flex-col justify-center">
//               <NavigationMenu className="space-x-4">
//                   <NavigationMenuList>
//                     <NavigationMenuItem>
//                       <NavigationMenuLink asChild>
//                         <Link to="/status" className={navigationMenuTriggerStyle()}>
//                           Status
//                         </Link>
//                       </NavigationMenuLink>
//                     </NavigationMenuItem>
//                     <NavigationMenuItem>
//                       <NavigationMenuLink className={navigationMenuTriggerStyle()}>
//                       { !isAuthenticated ?
//                         (
//                           <Button 
//                             variant={"ghost"}
//                             onClick={() => navigate('/login')}
//                             className="bg-navy hover:bg-bg-lightBlue">
//                             Log in
//                           </Button>
//                         ) : ( 
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="overflow-hidden rounded-full"
//               >
//                 <img
//                   src={'/male-avatar.png'}
//                   width={36}
//                   height={36}
//                   alt="Avatar"
//                   className="overflow-hidden rounded-full"
//                 />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>My Account</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>Dashboard</DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={signOut}>Log out</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//                         )
//                       }
//                       </NavigationMenuLink>
//                     </NavigationMenuItem>
//                   </NavigationMenuList>
//               </NavigationMenu>
//             </div>
            
//             <div className="sm:hidden flex-1 flex justify-end">
//                 <HamburgerMenu />
//             </div>
//           </div>
//           <Separator className="w-full border-t-2 border-gray-200 mt-4"/>
//         </div>
//       )
//     }
  
//     const ListItem = React.forwardRef<
//     React.ElementRef<"a">,
//     React.ComponentPropsWithoutRef<"a">
//   >(({ className, title, children, ...props }, ref) => {
//     return (
//       <li>
//         <NavigationMenuLink asChild>
//           <a
//             ref={ref}
//             className={cn(
//               "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
//               className
//             )}
//             {...props}
//           >
//             <div className="text-sm font-medium leading-none">{title}</div>
//             <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//               {children}
//             </p>
//           </a>
//         </NavigationMenuLink>
//       </li>
//     )
//   })
//   ListItem.displayName = "ListItem"
    
// export default Navigation
    