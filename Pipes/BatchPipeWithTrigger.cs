using DataflowApp.Hubs;
using System.Threading.Tasks.Dataflow;

namespace DataflowApp.Pipes
{
    public class BatchPipeWithTrigger : BatchPipe
    {
        public BatchPipeWithTrigger(IServiceProvider sp): 
            base(sp) { }

        public void TriggerBatch()
        {
            (EntryPoint as BatchBlock<Shape>)?
                .TriggerBatch();
        }
    }
}
