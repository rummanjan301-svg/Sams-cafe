/**
 * Time utility for calculating cafe open/closed status in Pakistan Standard Time (PKT, UTC+5).
 * Operating hours: 10:00 AM to 02:00 AM (next morning), Monday through Sunday.
 */

export interface CafeStatus {
  isOpen: boolean;
  statusText: string;
  subText: string;
  nextEvent: string;
}

export function getCafeLiveStatus(): CafeStatus {
  // Get current date/time converted to Pakistan Time (UTC+5)
  const now = new Date();
  const utcMillis = now.getTime() + (now.getTimezoneOffset() * 60000);
  const pktDate = new Date(utcMillis + (5 * 3600000));

  const hours = pktDate.getHours();
  const minutes = pktDate.getMinutes();
  const currentTotalMinutes = hours * 60 + minutes;

  // 10:00 AM is 600 minutes
  // 02:00 AM next day is equivalent to 26 hours (1560 minutes) or [00:00, 02:00) = [0, 120) minutes
  // Cafe is OPEN if:
  // - Between 10:00 AM (600 mins) and 23:59 (1439 mins)
  // - OR between 00:00 (0 mins) and 02:00 AM (120 mins)
  const isOpen = currentTotalMinutes >= 600 || currentTotalMinutes < 120;

  if (isOpen) {
    if (currentTotalMinutes < 120) {
      const remainingMinutes = 120 - currentTotalMinutes;
      const remHours = Math.floor(remainingMinutes / 60);
      const remMins = remainingMinutes % 60;
      return {
        isOpen: true,
        statusText: "OPEN NOW",
        subText: `Closes at 2:00 AM PKT (${remHours > 0 ? `${remHours}h ` : ''}${remMins}m remaining)`,
        nextEvent: "Closes at 2:00 AM"
      };
    } else {
      return {
        isOpen: true,
        statusText: "OPEN NOW",
        subText: "Open tonight until 2:00 AM PKT",
        nextEvent: "Closes at 2:00 AM"
      };
    }
  } else {
    const minutesUntilOpen = 600 - currentTotalMinutes;
    const hoursUntil = Math.floor(minutesUntilOpen / 60);
    const minsUntil = minutesUntilOpen % 60;
    return {
      isOpen: false,
      statusText: "CURRENTLY CLOSED",
      subText: `Opens today at 10:00 AM PKT (in ${hoursUntil}h ${minsUntil}m)`,
      nextEvent: "Opens at 10:00 AM"
    };
  }
}
