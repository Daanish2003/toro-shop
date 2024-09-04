"use client"
import { cn } from '@/lib/utils'
import { Home, LineChart, Package, ShoppingCart, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <>
      <nav className='grid items-start px-2 text-sm font-medium lg:px-4'>
        <Link href="/dashboard" className={cn(pathname === '/dashboard' ? "bg-muted text-primary" : "text-muted-foreground",'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary')}>
          <Home className='h-4 w-4'/>
          <span>Dashboard</span>
        </Link>
        <Link href="/products" className={cn(pathname === '/products' ? "bg-muted text-primary" : "text-muted-foreground",'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary')}>
          <Package className='h-4 w-4'/>
          <span>Products</span>
        </Link>
        <Link href="/orders" className={cn(pathname === '/orders' ? "bg-muted text-primary" : "text-muted-foreground",'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary')}>
          <ShoppingCart className='h-4 w-4'/>
          <span>Orders</span>
        </Link>
        <Link href="/customers" className={cn(pathname === '/customers' ? "bg-muted text-primary" : "text-muted-foreground",'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary')}>
          <User className='h-4 w-4'/>
          <span>Customers</span>
        </Link>
        <Link href="/analytics" className={cn(pathname === '/analytics' ? "bg-muted text-primary" : "text-muted-foreground",'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary')}>
          <LineChart className='w-4 h-4'/>
          <span>Analytics</span>
        </Link>
      </nav>
    </>
  )
}

export default Sidebar