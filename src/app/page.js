import Link from "next/link";
import * as THREE from "three";

export default function Home() {
  return (
    <div>
      <Link href={"/auth/signup"}>Sign Up</Link>
    </div>
  )
}
