import { Navbar } from "@/components/Navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Globe, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

const DevelopersPage = () => {
  const developers = [
    {
      name: "Patarapisit Thongkerd",
      role: "StudentId : 65007912",
      // bio: "React specialist focused on creating intuitive and responsive user interfaces. Passionate about web3 technologies and decentralized applications.",
      avatar: "/IMG_1515.png?height=200&width=200",
      // github: "https://github.com",
      // twitter: "https://twitter.com",
      // website: "https://example.com",
    },
    {
      name: "Thanakorn Singkom",
      role: "StudentId : 65007905",
      // bio: "Creative director with a background in UX/UI design and project management. Bridging the gap between technical implementation and user experience.",
      avatar: "/462560122_584464394082815_9066323379568250970_n.jpg?height=200&width=200",
      // github: "https://github.com",
      // twitter: "https://twitter.com",
      // website: "https://example.com",
    },
    {
      name: "Hannarong Boonyuen",
      role: "StudentId : 65057638",
      // bio: "Blockchain enthusiast with 5+ years of experience in Solidity development. Specialized in secure NFT implementations and access control systems.",
      avatar: "/462556490_548955694689050_2635476944577785612_n.jpg?height=200&width=200",
      // github: "https://github.com",
      // twitter: "https://twitter.com",
      // website: "https://example.com",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 vault-container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-5xl font-bold tracking-tight text-gradient">Our Team</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Meet the talented developers behind the NFT Vault Access project.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {developers.map((dev, index) => (
              <Card
                key={index}
                className="glass-card border-vault-300/20 hover:border-vault-300/50 transition-all duration-300"
              >
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto rounded-full overflow-hidden w-32 h-32 mb-4 bg-vault-100 p-1">
                    <img
                      src={dev.avatar || "/placeholder.svg"}
                      alt={dev.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <CardTitle className="text-xl">{dev.name}</CardTitle>
                  <CardDescription className="text-vault-500 font-medium">{dev.role}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  {/* <p className="text-muted-foreground text-sm mb-4">{dev.bio}</p> */}
                  <div className="flex justify-center gap-3">
                    {/* <Button variant="ghost" size="icon" asChild>
                      <a href={dev.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <Github className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={dev.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <Twitter className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={dev.website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                        <Globe className="h-5 w-5" />
                      </a>
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="vault-container text-center text-sm text-muted-foreground">
          <p>&copy; 2025 NFT Vault Access. All rights reserved | FOG3KP.</p>
        </div>
      </footer>
    </div>
  )
}

export default DevelopersPage
