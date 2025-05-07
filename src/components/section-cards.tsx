import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  const [newUserData, setNewUserData] = useState<{
    new_user_count: number;
    growth_rate_percent: string;
  } | null>(null);

  const [newPinData, setNewPinData] = useState<{
    new_post_count: number;
    growth_rate_percent: string;
  } | null>(null);

  // Dữ liệu Active Users và tỷ lệ
  const [activeUserData, setActiveUserData] = useState<{
    total_users: number;
    active_users: number;
    active_rate_percent: string;
  } | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/auth/admin/dashboard/newPin")
      .then((res) => res.json())
      .then((data) => setNewPinData(data))
      .catch((err) => console.error("Error fetching new pin data:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/api/auth/admin/dashboard/newUser")
      .then((res) => res.json())
      .then((data) => setNewUserData(data))
      .catch((err) => console.error("Error fetching new user data:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/api/auth/admin/dashboard/userActive")
      .then((res) => res.json())
      .then((data) => setActiveUserData(data))
      .catch((err) => console.error("Error fetching active user data:", err));
  }, []);

  const growth = parseFloat(newUserData?.growth_rate_percent || "0");
  const isUp = growth >= 0;

  const pinGrowth = parseFloat(newPinData?.growth_rate_percent || "0");
  const isPinUp = pinGrowth >= 0;

  // Active User Growth
  const activeGrowth = parseFloat(activeUserData?.active_rate_percent || "0");
  const isActiveUp = activeGrowth >= 0;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Pins</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {newPinData ? newPinData.new_post_count : "Loading..."}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {isPinUp ? <IconTrendingUp /> : <IconTrendingDown />}
              {newPinData ? `${Math.abs(pinGrowth).toFixed(2)}%` : ""}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {isPinUp
              ? `Pin growth increased by ${Math.abs(pinGrowth).toFixed(2)}%`
              : `Pin growth dropped by ${Math.abs(pinGrowth).toFixed(2)}%`}
            {isPinUp ? (
              <IconTrendingUp className="size-4 text-green-500" />
            ) : (
              <IconTrendingDown className="size-4 text-red-500" />
            )}
          </div>
          <div className="text-muted-foreground">
            {isPinUp
              ? "More pins created this month."
              : "Fewer pins created than last month."}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {newUserData ? newUserData.new_user_count : "Loading..."}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {isUp ? <IconTrendingUp /> : <IconTrendingDown />}
              {newUserData ? `${Math.abs(growth).toFixed(2)}%` : ""}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {isUp
              ? `User growth increased by ${Math.abs(growth).toFixed(2)}%`
              : `User growth dropped by ${Math.abs(growth).toFixed(2)}%`}
            {isUp ? (
              <IconTrendingUp className="size-4 text-green-500" />
            ) : (
              <IconTrendingDown className="size-4 text-red-500" />
            )}
          </div>
          <div className="text-muted-foreground">
            {isUp
              ? "Steady increase in user acquisition this month."
              : "User acquisition slowed down compared to last month."}
          </div>
        </CardFooter>
      </Card>

      {/* New Card for Active Users */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {activeUserData ? activeUserData.active_users : "Loading..."}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {isActiveUp ? <IconTrendingUp /> : <IconTrendingDown />}
              {activeUserData ? `${Math.abs(activeGrowth).toFixed(2)}%` : ""}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {isActiveUp
              ? `Active accounts increased by ${Math.abs(activeGrowth).toFixed(2)}%`
              : `Active accounts dropped by ${Math.abs(activeGrowth).toFixed(2)}%`}
            {isActiveUp ? (
              <IconTrendingUp className="size-4 text-green-500" />
            ) : (
              <IconTrendingDown className="size-4 text-red-500" />
            )}
          </div>
          <div className="text-muted-foreground">
            {isActiveUp
              ? "More active users this month."
              : "Fewer active users than last month."}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}
  