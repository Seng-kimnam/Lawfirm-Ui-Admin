import { motion, AnimatePresence } from "framer-motion";
import Button from "./button/Button";
interface CustomModalProps {
  open: boolean;
  title?: string;
  onOk: () => void;
  onCancel: () => void;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

/** Animated custom modal */
export const CustomModal: React.FC<CustomModalProps> = ({
  open,
  title,
  onOk = () => {},
  onCancel = () => {},
  footer,
  children,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Background overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* Modal content */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center p-4   bg-black/40 backdrop-blur-sm z-5"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ duration: 0.25 }}
          >
            <div className="bg-white dark:bg-dark-900 rounded-md w-[400px] p-5 shadow-lg dark:bg-white/[0.10] dark:border dark:border-white/[0.05] dark:text-white">
              {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

              <div>{children}</div>

              {/* Footer */}
              <div className="mt-15 flex justify-end gap-3">
                {footer ? (
                  footer
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                    //   onClick={() => setOpen(false)}
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>

                    <Button
                      size="sm"
                      variant="primary"
                    //   onClick={() => setOpen(false)}
                      onClick={onOk}
                    >
                      Create
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
