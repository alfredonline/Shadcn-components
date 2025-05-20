"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BellIcon, CheckCircle2Icon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Notification } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

const MAX_MESSAGE_LENGTH = 100;

export default function UserNotifications({
  notifications,
}: {
  notifications: Notification[];
}) {
  const [readNotifications, setReadNotifications] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  const handleReadClick = (notification: Notification) => {
    localStorage.setItem(`readNotifications`, JSON.stringify([...readNotifications, notification.id]));
    setReadNotifications([...readNotifications, notification.id]);
  }

  const handleMarkAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    localStorage.setItem(`readNotifications`, JSON.stringify(allIds));
    setReadNotifications(allIds);
  }

  const toggleMessage = (notificationId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const storedReadNotifications = localStorage.getItem(`readNotifications`);
    if (storedReadNotifications) {
      setReadNotifications(JSON.parse(storedReadNotifications));
    }
  }, []);

  const unreadCount = notifications?.filter(n => !readNotifications.includes(n.id)).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-red-600 rounded-full animate-pulse">
              {unreadCount > 10 ? "10+" : unreadCount}
            </span>
          )}
          <BellIcon className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications?.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500">
              <BellIcon className="w-8 h-8 mb-2" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y">
              {notifications?.map((notification) => (
                <div 
                  key={notification.id} 
                  className={cn(
                    "flex items-start gap-3 p-4 transition-colors",
                    !readNotifications.includes(notification.id) && "bg-gray-50"
                  )}
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                      <BellIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-medium leading-tight">{notification.title}</h3>
                      {!readNotifications.includes(notification.id) && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleReadClick(notification)}
                          className="h-6 w-6"
                        >
                          <CheckCircle2Icon className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="mt-1">
                      <p className={cn(
                        "text-sm text-gray-500",
                        !expandedMessages.has(notification.id) && "line-clamp-2"
                      )}>
                        {notification?.message}
                      </p>
                      {notification?.message && notification.message.length > MAX_MESSAGE_LENGTH && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleMessage(notification.id)}
                          className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                        >
                          {expandedMessages.has(notification.id) ? (
                            <>
                              Show less <ChevronUpIcon className="w-3 h-3 ml-1" />
                            </>
                          ) : (
                            <>
                              Show more <ChevronDownIcon className="w-3 h-3 ml-1" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    {notification?.createdAt && (
                      <p className="mt-1 text-xs text-gray-400">
                        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
