import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="border-t border-border bg-card"
        >
            <div className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:px-16">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
                    <div className="space-y-3">
                        <Logo className="text-2xl" />
                        <p className="body-text text-sm leading-relaxed text-muted-foreground max-w-xs">
                            Predict the market.
                            <br />
                            Let the price decide.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h4 className="body-text text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Navigate
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="body-text text-sm text-foreground transition-colors hover:text-accent"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/app"
                                    className="body-text text-sm text-foreground transition-colors hover:text-accent"
                                >
                                    Market
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="body-text text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Connect
                        </h4>
                        <div className="flex items-center gap-4">
                            <a
                                href="#"
                                aria-label="GitHub"
                                className="text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <FontAwesomeIcon icon={faGithub} className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                aria-label="LinkedIn"
                                className="text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <FontAwesomeIcon icon={faLinkedin} className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="body-text text-xs text-muted-foreground">
                        &copy; 2025 OPTO. All rights reserved.
                    </p>
                    <p className="body-text text-xs text-muted-foreground italic">
                        Predict the market. Let the price decide.
                    </p>
                </div>
            </div>
        </motion.footer>
    );
}

export default Footer;