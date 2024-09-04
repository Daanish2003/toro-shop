"use client"
import React from 'react'
import Sidebar from './sidebar'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { Home, LineChart, Menu, Package, Package2, Search, ShoppingCart, Users } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import UserMenu from './userMenu'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'


const DashboardNavbar = () => {
  const pathname = usePathname()
  return (
    <>
     <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">TORO-SHOP</span>
                </Link>
                <Link
                  href="/dashboard"
                  className={cn(pathname === "/dashboard" ? "bg-muted text-primary": "text-muted-foreground", "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2  hover:text-foreground")}
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/products"
                  className={cn(pathname === "/products" ? "bg-muted text-primary": "text-muted-foreground", "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2  hover:text-foreground")}
                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  href="/orders"
                  className={cn(pathname === "/orders" ? "bg-muted text-primary": "text-muted-foreground", "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2  hover:text-foreground")}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                  href="/customers"
                  className={cn(pathname === "/customers" ? "bg-muted text-primary": "text-muted-foreground", "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2  hover:text-foreground")}
                >
                  <Users className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="/analytics"
                  className={cn(pathname === "/analytics" ? "bg-muted text-primary": "text-muted-foreground", "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2  hover:text-foreground")}
                >
                  <LineChart className="h-5 w-5" />
                  Analytics
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <UserMenu />
        </header>
    </>
  )
}

export default DashboardNavbar